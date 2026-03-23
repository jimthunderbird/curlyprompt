TARGET = 24
THRESHOLD = 1e-7


class Chunk:
    def __init__(self, number, text=None):
        self.total = number
        self.text = text if text is not None else str(number)

    def __lt__(self, other):
        return self.total < other.total

    def __eq__(self, other):
        return self.text == other.text

    def __hash__(self):
        return hash(self.text)

    def __str__(self):
        return self.text


def _add(a, b):
    return Chunk(a.total + b.total, f"({a.text} + {b.text})")

def _multiply(a, b):
    return Chunk(a.total * b.total, f"({a.text} * {b.text})")

def _subtract(a, b):
    return Chunk(a.total - b.total, f"({a.text} - {b.text})")

def _divide(a, b):
    return Chunk(a.total / b.total, f"({a.text} / {b.text})")


OPERATIONS = (_add, _multiply, _subtract, _divide)


def _solve(chunks, target=TARGET):
    """Find all expressions from chunks that equal target. Returns a list of solution strings."""
    solutions = set()
    closed = set()
    open_set = {tuple(sorted(chunks))}

    while open_set:
        state = open_set.pop()
        if state in closed:
            continue
        closed.add(state)

        if len(state) == 1:
            if abs(state[0].total - target) < THRESHOLD:
                solutions.add(state[0].text)
            continue

        for c1 in state:
            rest1 = list(state)
            rest1.remove(c1)
            for c2 in rest1:
                rest2 = list(rest1)
                rest2.remove(c2)
                for op in OPERATIONS:
                    try:
                        new_chunk = op(c1, c2)
                    except ZeroDivisionError:
                        continue
                    new_state = tuple(sorted(rest2 + [new_chunk]))
                    open_set.add(new_state)

    return sorted(solutions)


def run(numbers):
    """
    Given four numbers, finds all ways to combine them using +, -, *, / to get exactly 24.
    :param numbers: A list of four numbers to use in the Game of 24.
    """
    chunks = [Chunk(n) for n in numbers]
    solutions = _solve(chunks)

    if solutions:
        print(f"Found {len(solutions)} solution(s) for {numbers}:")
        for s in solutions:
            print(f"  {s} = 24")
        return "\n".join(solutions)
    else:
        print(f"No solution found for {numbers}.")
        return "No solution found."


if __name__ == "__main__":
    result = run([1, 2, 3, 4])
    print(result)
