terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

provider "aws" {
  profile = "default"
  region  = var.region
}

resource "aws_eip_association" "eip_assoc" {
  instance_id   = aws_instance.web.id
  allocation_id = var.aws_eip_id
}

resource "aws_instance" "web" {
  ami           = var.ami
  instance_type = "t2.micro"
}
