
def validate_input(data):
    if not data:
        return False

    if not isinstance(data, dict):
        return False

    return True
