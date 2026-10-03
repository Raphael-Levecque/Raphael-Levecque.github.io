def reverse_string(some_str : str) -> str:
    res = ""
    len_str = len(some_str)
    for i in range(len_str-1,-1,-1):
        res += some_str[i]
    return res
    

if __name__ == "__main__":
    str_enigma = "62549619d8edd5c5=is?vv2q89CeR6x1uozxQANxh5/tsilyalp/moc.yfitops.nepo//:sptth"
    print(reverse_string(str_enigma))