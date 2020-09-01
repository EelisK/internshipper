variable "region" {
  type        = string
  default     = "eu-central-1"
  description = "aws region"
}

variable "ami" {
  type        = string
  default     = "ami-0130bec6e5047f596"
  description = "aws ami"
}

variable "aws_eip_id" {
  type        = string
  default     = "eipalloc-02068b03e01ca5aba"
  description = "id of the allocated ip address"
}
