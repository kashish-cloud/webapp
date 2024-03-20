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

variable "ssh_username" {
  type    = string
  default = "csye6225"
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
  ssh_username        = var.ssh_username
  zone                = var.zone
}

build {
  sources = ["source.googlecompute.centos-stream-8"]

  provisioner "file" {
    source      = "/home/runner/work/webapp/config.yaml"
    destination = "/tmp/"
  }

  provisioner "file" {
    source      = "./script.sh"
    destination = "/tmp/"
  }

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/"
  }

  provisioner "shell" {
    inline = [
      "chmod +x /tmp/script.sh",
      "/tmp/script.sh",
      "curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh",
      "sudo bash add-google-cloud-ops-agent-repo.sh --also-install",
      "sudo systemctl start google-cloud-ops-agent",
      "sudo systemctl enable google-cloud-ops-agent"
    ]
  }
}