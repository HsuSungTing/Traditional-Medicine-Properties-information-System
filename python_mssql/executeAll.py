import subprocess
import time
# 定义要执行的 Python 脚本文件列表
script_files = ["uploadTable1.py", "uploadTable2.py", "uploadTable5.py", "uploadTable4.py", "uploadAssoTable.py"]

# 遍历执行脚本文件列表
for script_file in script_files:
    try:
        result = subprocess.run(["python", script_file], capture_output=True, text=False)
        if result.returncode == 0:
            #output = result.stdout.decode('utf-8')  # 手动解码输出
            print(f"程式碼 {script_file} 執行成功：\n\n{result.stdout}")
        else:
            #output = result.stdout.decode('utf-8')  # 手动解码输出
            print(f"程式碼 {script_file} 執行失敗：\n\n{result.stderr}")
    except Exception as e:
        print(f"執行程式碼 {script_file} 發生錯誤：{e}")
    
    # 等待五秒
    print("wait for 1 seconds")
    time.sleep(1)
