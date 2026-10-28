def verify_image_magic_bytes(contents: bytes) -> bool:
    """
    Verify if the file content starts with standard image magic bytes:
    - JPEG: FF D8 FF
    - PNG: 89 50 4E 47 0D 0A 1A 0A
    - GIF: GIF87a (47 49 46 38 37 61) or GIF89a (47 49 46 38 39 61)
    - WEBP: RIFF at offset 0, and WEBP at offset 8-11 (52 49 46 46 ... 57 45 42 50)
    """
    if contents.startswith(b"\xff\xd8\xff"):
        return True
    if contents.startswith(b"\x89PNG\r\n\x1a\n"):
        return True
    if contents.startswith(b"GIF87a") or contents.startswith(b"GIF89a"):
        return True
    if contents.startswith(b"RIFF") and b"WEBP" in contents[8:16]:
        return True
    return False

def verify_document_magic_bytes(contents: bytes) -> bool:
    """
    Verify if the file content starts with standard document magic bytes:
    - PDF: %PDF- (25 50 44 46 2d)
    - DOCX/ZIP: PK\\x03\\x04, PK\\x05\\x06, PK\\x07\\x08 (50 4b ...)
    - DOC (OLE2 Compound File Header): D0 CF 11 E0 A1 B1 1A E1
    """
    if contents.startswith(b"%PDF-"):
        return True
    if contents.startswith(b"PK\x03\x04") or contents.startswith(b"PK\x05\x06") or contents.startswith(b"PK\x07\x08"):
        return True
    if contents.startswith(b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1"):
        return True
    return False
