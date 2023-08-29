from sqlalchemy import create_engine, inspect # pip install SQLAlchemy
from sqlalchemy.engine import URL
import pypyodbc # pip install pypyodbc
import pandas as pd # pip install pandas
import re
import math


SERVER_NAME = 'LAPTOP-B6OG51F6'
DATABASE_NAME = 'med_DB2'
TABLE_NAME = 'MedAssociate'
excel_file = './Med_table.xlsx'
connection_string = f"""
    DRIVER={{SQL Server}};
    SERVER={SERVER_NAME};
    DATABASE={DATABASE_NAME};
    Trusted_Connection=yes;
"""
connection_url = URL.create('mssql+pyodbc', query={'odbc_connect': connection_string})
engine = create_engine(connection_url, module=pypyodbc)
# get table Attribute info
inspector = inspect(engine)
table_columns = inspector.get_columns(TABLE_NAME)

# for single sheet
excel_sheet = pd.read_excel(excel_file, sheet_name=TABLE_NAME)

# preprocess the excel file
print("Processing MedAssociate Table...")
#處理數值欄位必為數值 否則改Nan
# check which is numerate
numeric_columns = [column['name'] for column in table_columns if column['type'].python_type in (int, float)]
# non numerate data turn into Nan
for col in numeric_columns:
    excel_sheet[col] = pd.to_numeric(excel_sheet[col], errors='coerce')




#處理foreign key連接問題
# check foreign key 
def check_foreign_key(ref_tb, attribute, my_attr):
    global excel_sheet
    # get all id in ref table
    query = f"SELECT {attribute.lower()} FROM {ref_tb}"
    ref_table = pd.read_sql_query(query, engine)
    existing_ids = set(ref_table[attribute.lower()])#讀取sql出來的attribute不會區分大小寫一律都小寫出來
    # find excel id not in ref table
    missing_ids = excel_sheet[~excel_sheet[my_attr].isin(existing_ids)][my_attr].tolist()
    
    # remove rows  which id not in ref table
    if len(missing_ids) > 0:
        print(f"以下 {my_attr} 在 ref table中不存在: {missing_ids}\n已移除")
        excel_sheet = excel_sheet[excel_sheet[my_attr].isin(existing_ids) ]


check_foreign_key("AllMed", "Med_id", "Med_id")
check_foreign_key("AllMed", "Med_id", "Comp_id")


if excel_sheet.empty:
    print("empty excel")
    exit()  # 結束程式

#處理primary key獨立問題
# primary key independence 
invalid_ids = []# collect not number data row
for _, row in excel_sheet.iterrows():
    try:
        id_value = int(row['Asso_id'])
        row['Asso_id'] = id_value
    except ValueError:
        invalid_ids.append(row['Asso_id'])
    
# check duplicate ID
existing_ids_df=[]
with engine.connect() as conn:
    result=conn.execute(f'select Asso_id from {TABLE_NAME}')
    allresult = result.fetchall()
    existing_ids_df = [item[0] for item in allresult]
    
duplicate_ids = excel_sheet[excel_sheet.duplicated('Asso_id')]['Asso_id'].tolist()
duplicate_ids += excel_sheet[excel_sheet['Asso_id'].isin(existing_ids_df)]['Asso_id'].tolist()

# non number ID OR duplicated ID, Remove them from excel file which going to load to sql
if invalid_ids or duplicate_ids:
    print("Invalid or duplicate IDs found in Excel data:")
    if invalid_ids:
        print("Invalid IDs:", invalid_ids)
    if duplicate_ids:
        print("Duplicate IDs:", duplicate_ids)
    excel_sheet = excel_sheet[~excel_sheet['Asso_id'].isin(invalid_ids + duplicate_ids)]



if excel_sheet.empty:
    print("empty excel")
    exit()  # 結束程式



# 處理not null的值有Null就不可以放進去
# check which not Null 
not_null_columns = [column['name'] for column in table_columns if not column['nullable']]

# take out rows that contain null in not null column
invalid_rows = excel_sheet[excel_sheet[not_null_columns].isnull().any(axis=1)]

# remove and print them
excel_sheet = excel_sheet.dropna(subset=not_null_columns)
if not invalid_rows.empty:
    print("Rows with NULL values in non-nullable columns:")
    print(invalid_rows)

# 将 NaN 替换为 NULL
excel_sheet.fillna("NULL", inplace=True)
if excel_sheet.empty:
    print("empty excel")
    exit()  # 結束程式
    
# write data to sql
excel_sheet.to_sql(TABLE_NAME, engine, if_exists='append', index=False)


