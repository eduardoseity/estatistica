import pandas as pd

excel_file = '../../../Experimentos/Loterias/excel/Mega-Sena.xlsx'
json_file = '../../../Experimentos/Loterias/json/Mega-Sena.json'
df = pd.read_excel(excel_file)
df.to_json(json_file, orient='records')
print('Convertido')