#!/bin/bash
#Want to execute SF2 commands inside your vagrant?
#This way you can use i.e.: $`sammui router:debug`

#Easy install:
#On your .bashrc ou the global one you can just proccess this file (or alias.sh by your needs):
#In the end of the file:
#. ~/SAMMUI_FOLDER/bin/alias_template.sh
#or
#source ~/SAMMUI_FOLDER/bin/alias_template.sh

sammui_host_folder='~/Vagrant/sammui'; #Sammui folder on your pc: Usually inside Vagrant folder
sammui_guest_folder='/vagrant/sammui'; #Sammui folder inside vagrant
sammui_vagrant_ip='www.sammui.dev'; #Your vagrant IP
sammui_vagrant_port='22'; #If you don't have an IP you can use the vagrant default redirect

alias sammui="
    ssh -p $sammui_vagrant_port -i $sammui_host_folder/docs/vagrant/ssh/id_rsa
    vagrant@$sammui_vagrant_ip
    $sammui_guest_folder/app/console --env=dev"