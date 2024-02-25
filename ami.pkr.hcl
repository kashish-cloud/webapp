variable "project_id" {
  type    = string
  default = "tf-gcp-infra-project"
}

variable "image_family" {
  type    = string
  default = "centos-stream-8"
}

variable "image_project" {
  type    = string
  default = "centos-cloud"
}

variable "custom_image_family" {
  type    = string
  default = "csye6225-custom-image-family"
}

variable "custom_image_name" {
  type    = string
  default = "csye6225-custom-image"
}

variable "machine_type" {
  type    = string
  default = "n1-standard-2"
}

variable "disk_size" {
  type    = string
  default = "100"
}

variable "zone" {
  type    = string
  default = "us-east1-b"
}

packer {
  required_plugins {
    googlecompute = {
      version = ">= 1.1.4"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

source "googlecompute" "centos-stream-8" {
  project_id          = var.project_id
  image_family        = var.image_family
  source_image_family = var.image_family
  zone                = var.zone
}

build {
  sources = ["source.googlecompute.centos-stream-8"]

  provisioner "file" {
    source      = "./script.sh"
    destination = "/tmp/script.sh"
  }

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "shell" {
    inline = [
      "chmod +x /tmp/script.sh",
      "/tmp/script.sh"
    ]
  }
}