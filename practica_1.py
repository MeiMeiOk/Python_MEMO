i = 3
saldo = 0

def cajero(saldo):
    retiro = 0
    deposito = 0
    opc = 0
    while opc != 4:
        opc = int(input("\nBienvenido al cajero automático\n\n1. Consultar saldo\n2. Retirar dinero\n3. Depositar dinero\n4. Salir\nSeleccione una opción: "))

        match opc:
            case 1:
                print("Tu saldo es de: ", saldo)
                input("Presiona Enter para continuar...")

            case 2:
                retiro = int(input("¿Cuánto dinero desea retirar?: "))
                if retiro > saldo:
                    print("Saldo insuficiente")
                else:
                    saldo -= retiro
                    print(f"Tu retiro de {retiro} pesos ha sido realizado")
                input("Presiona Enter para continuar...")

            case 3:
                deposito = int(input("¿Cuánto dinero desea depositar?: "))
                saldo += deposito
                print("Listo, tu dinero ha sido depositado a tu cuenta")
                input("Presiona Enter para continuar...")

            case 4:
                print("Gracias por usar el Cajero Guillermin")

    return saldo


while i != 0:
    pin1 = int(input("Bienvenido al Cajero Guillermin\n\nIntroduce tu código de 4 dígitos: "))
    if pin1 == 1234:
        saldo = cajero(saldo)
        break
    else:
        i -= 1
        print(f"\nCódigo incorrecto, te quedan {i} intentos")
        if i == 0:
            print("Llamando a seguridad...")