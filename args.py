from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-r", "--request", dest="request",
                    help="request filter configuration file", required=True)
parser.add_argument("-i", "--interval", dest="interval", default=10, type=int)
parser.add_argument("--exclude-advanced-students",
                    dest="exclude_advanced_students", type=bool, default=False)


args = parser.parse_args()
