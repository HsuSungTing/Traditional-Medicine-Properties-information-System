from sqlalchemy import create_engine, inspect # pip install SQLAlchemy
from sqlalchemy.engine import URL
import pypyodbc # pip install pypyodbc
import pandas as pd # pip install pandas
import re


SERVER_NAME = 'LAPTOP-B6OG51F6'
DATABASE_NAME = 'med_DB2'
TABLE_NAME = 'MedSource'
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
excel_sheet = pd.read_excel(excel_file, sheet_name="MedSource")

# preprocess the excel file
print("Processing MedSource Table...")
#處理primary key獨立問題
# primary key independence 
invalid_ids = []# collect not number data row
for _, row in excel_sheet.iterrows():
    try:
        id_value = int(row['Source_id'])
        row['Source_id'] = id_value
    except ValueError:
        invalid_ids.append(row['Source_id'])

    

# check duplicate ID

existing_ids_df=[]
with engine.connect() as conn:
    result=conn.execute(f'select Source_id from {TABLE_NAME}')
    allresult = result.fetchall()
    existing_ids_df = [item[0] for item in allresult]
    
duplicate_ids = excel_sheet[excel_sheet.duplicated('Source_id')]['Source_id'].tolist()
duplicate_ids += excel_sheet[excel_sheet['Source_id'].isin(existing_ids_df)]['Source_id'].tolist()

# non number ID OR duplicated ID, Remove them from excel file which going to load to sql
if invalid_ids or duplicate_ids:
    print("Invalid or duplicate IDs found in Excel data:")
    if invalid_ids:
        print("Invalid IDs:", invalid_ids)
    if duplicate_ids:
        print("Duplicate IDs:", duplicate_ids)
    excel_sheet = excel_sheet[~excel_sheet['Source_id'].isin(invalid_ids + duplicate_ids)]



#處理數值欄位必為數值或Null的問題
# check which is numerate
numeric_columns = [column['name'] for column in table_columns if column['type'].python_type in (int, float)]

# non numerate data turn into Nan
for col in numeric_columns:
    excel_sheet[col] = pd.to_numeric(excel_sheet[col], errors='coerce')

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

# 換行換空格或者拔掉?
# function for newline replace by space
def replace_newlines_and_spaces(cell_data):
    if isinstance(cell_data, str):
        #return cell_data.replace("\n", "").replace(" ", "")
        return cell_data.replace("\n", "")
    return cell_data

# use applymap to apply function for each cell
excel_sheet = excel_sheet.applymap(replace_newlines_and_spaces)

#檢查文字長度
# 對特殊符號處理
# a function for cut string
def truncate_data(data, max_length):
    if isinstance(data, str) and len(data) > max_length:
        print("this data too long:"+data)
        return data[:max_length]
    return data

# a functionn for special charactor
def remove_special_chars(cell_value):
    cell_value = cell_value.replace("（", "(")#全形半形括號統一
    cell_value = cell_value.replace("）", ")")
    special_chars_pattern = r'[!@#$%^&*_+=\\/:;,<>?"\'`~\[\]{}|]'
    return re.sub(special_chars_pattern, '', cell_value)

# each cell max length 500
for column in excel_sheet.columns:
    if excel_sheet[column].dtype == "object":
        if(column!="Source_link"):
            excel_sheet[column].fillna("", inplace=True)#替換所有nan to  ""
            excel_sheet[column] = excel_sheet[column].apply(lambda x: remove_special_chars(str(x)))
            excel_sheet[column] = excel_sheet[column].apply(lambda x: truncate_data(x, 500))
            


if excel_sheet.empty:
    print("empty excel")
    exit()  # 結束程式

# write data to sql
excel_sheet.to_sql(TABLE_NAME, engine, if_exists='append', index=False)




