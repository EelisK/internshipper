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

resource "aws_key_pair" "deployer" {
  key_name   = "deployer-key"
  public_key = var.public_key
}

resource "aws_instance" "web" {
  ami           = var.ami
  instance_type = "t2.micro"
  key_name      = aws_key_pair.deployer.key_name

  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = var.private_key
    host        = self.public_ip
  }

  provisioner "file" {
    source      = "./nginx/prod/proxy.conf"
    destination = "/tmp/proxy.conf"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo add-apt-repository -y ppa:nginx/stable",
      "sudo apt-get update -y",
      "sudo apt-get install -y nginx",
      "sudo mv /tmp/proxy.conf /etc/nginx/sites-available/proxy.conf",
      "sudo ln -sfn /etc/nginx/sites-available/proxy.conf /etc/nginx/sites-enabled/proxy.conf",
      "sudo rm /etc/nginx/sites-available/default",
      "sudo service nginx restart",
    ]
  }

  tags = {
    Name        = "internshipper-web"
    Environment = "production"
  }
}

resource "aws_security_group" "default_web_server" {
  name        = "default_web_server"
  description = "Allow HTTPS, HTTP, and SSH inbound traffic"

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "internshipper-web-security-group"
  }
}

resource "aws_network_interface_sg_attachment" "sg_attachment" {
  security_group_id    = aws_security_group.default_web_server.id
  network_interface_id = aws_instance.web.primary_network_interface_id
}
