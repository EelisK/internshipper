from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-r", "--request", dest="request",
                    help="request filter configuration file", required=True)
parser.add_argument("-i", "--interval", dest="interval", default=10)


args = parser.parse_args()
