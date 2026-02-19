import openpyxl
import re
from pathlib import Path

excel_file = "опт 19.02.26.xlsx"
js_file = "js/script.js"

if not Path(excel_file).exists():
    print(f"Ошибка: файл {excel_file} не найден.")
    exit(1)

wb = openpyxl.load_workbook(excel_file, data_only=True)
sheet = wb['Лист_1']

def detect_category(name):
    name_low = name.lower()
    if 'банк' in name_low and 'бутыл' not in name_low:
        return 'banks'
    elif 'бутылк' in name_low or 'бутыль' in name_low:
        return 'bottles'
    elif 'крышк' in name_low or 'колпач' in name_low:
        return 'lids'
    elif any(x in name_low for x in ['бак', 'бочк', 'канистр', 'фляг', 'ведр']):
        return 'containers'
    elif any(x in name_low for x in ['агро', 'плёнк', 'теплиц', 'парник', 'пруд']):
        return 'agriculture'
    elif any(x in name_low for x in ['лопат', 'вилы', 'метл', 'санк', 'грабл']):
        return 'tools'
    else:
        return 'home'

def extract_volume(name):
    match = re.search(r'(\d+[.,]?\d*)\s*(л|мл|литр)', name, re.IGNORECASE)
    if match:
        num = match.group(1).replace(',', '.')
        unit = match.group(2).lower()
        if unit.startswith('л'):
            return f"{num} л"
        else:
            return f"{num} мл"
    return '---'

def extract_diameter(name):
    match = re.search(r'd(\d+)', name)
    return f'd{match.group(1)}' if match else ''

# Правильные индексы столбцов (нумерация с 0)
NAME_IDX = 4      # колонка D
PRICE_IDX = 13    # колонка N
STOCK_IDX = 14    # колонка O

products = []
row_count = 0

for row in sheet.iter_rows(values_only=True):
    row_count += 1
    if len(row) <= max(NAME_IDX, PRICE_IDX, STOCK_IDX):
        continue

    name = row[NAME_IDX]
    price = row[PRICE_IDX]
    stock = row[STOCK_IDX]

    if not name or not isinstance(name, str):
        continue
    name = name.strip()
    if len(name) < 5:
        continue
    if any(x in name for x in ['Прайс-лист', 'Ценовая группа', 'Артикул', 'Номенклатура']):
        continue

    try:
        if price is None or stock is None:
            continue
        if isinstance(price, str):
            price = price.replace(',', '.').replace(' ', '')
        price_val = float(price)
        if isinstance(stock, str):
            stock = stock.replace(',', '').replace(' ', '')
        stock_val = float(stock)
    except (ValueError, TypeError):
        continue

    category = detect_category(name)
    volume = extract_volume(name)
    diameter = extract_diameter(name)

    products.append({
        'name': name,
        'price': round(price_val, 2),
        'stock': stock_val,
        'volume': volume,
        'category': category,
        'diameter': diameter
    })

print(f"Обработано строк: {row_count}")
print(f"Найдено товаров: {len(products)}")

if len(products) == 0:
    print("Товары не найдены. Проверьте индексы столбцов.")
    exit(1)

# Генерация нового JavaScript-массива
lines = ["const products = ["]
for p in products:
    safe_name = p['name'].replace('"', '\\"')
    line = (f'  {{ name: "{safe_name}", price: {p["price"]}, stock: {p["stock"]}, '
            f'volume: "{p["volume"]}", category: "{p["category"]}", diameter: "{p["diameter"]}" }},')
    lines.append(line)
lines.append("];")
new_products_block = "\n".join(lines)

# Чтение текущего js-файла
with open(js_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Замена содержимого между метками
import re
pattern = r'// PRODUCTS_START.*?// PRODUCTS_END'
replacement = f'// PRODUCTS_START\n{new_products_block}\n// PRODUCTS_END'
new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Запись обратно
with open(js_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"✅ Файл {js_file} успешно обновлён.")