BASE62="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def encode_base62(num : int) -> str :
    if num == 0:
        return BASE62[0]
    char = []
    while num > 0:
        remainder = num % 62
        char.append(BASE62[remainder])
        num = num // 62

    char.reverse()  
    return "".join(char)
