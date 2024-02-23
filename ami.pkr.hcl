packer {
  required_plugins {
    googlecompute = {
      version = ">= 1.0.0, < 2.0.0"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

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
  default = "us-east1-a"
}

variable "ssh_username" {
  type    = string
  default = "csye6225"
}

variable "ssh_private_key_file" {
  type    = string
  default = "/Users/kashishdesai/Downloads/tf-gcp-infra-project-b207c7f5b113.json"
}

source "googlecompute" "centos-stream-8" {
  project_id   = var.project_id
  image_family = var.image_family
  image_project = var.image_project
  source_image_family = var.image_family
  source_image_project = var.image_project
}

build {
  sources = ["source.googlecompute.centos-stream-8"]

  provisioner "shell" {
    script = "script.sh"
  }

  builders = [
    {
      type        = "googlecompute"
      project_id  = var.project_id
      image_family = var.custom_image_family
      image_name   = var.custom_image_name
      image_description = "Custom image for CSYE 6225 assignment"
      machine_type = var.machine_type
      disk_size    = var.disk_size
      zone         = var.zone
      ssh_username = var.ssh_username
      ssh_private_key_file = var.ssh_private_key_file
    }
  ]
}