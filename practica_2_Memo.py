frase=input("Ingresa tu frase a actualizar: ")
list = frase.split()
print("Lista de palabras:", list)

for palabra in list:
    print(palabra.upper())

search = input("Que palabra quieres contar?: ")
cantidad = frase.split().count(search)
print(f"La palabra '{search}' aparece {cantidad} veces.")

pal_replace = input("Escribe la palabra que quieres reemplazar: ")
nueva_pal = input("Escribe la nueva palabra: ")
frase_mod = frase.replace(pal_replace, nueva_pal)
print("Frase modificada:", frase_mod)