# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2019-07-26 09:36
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scriptmanager', '0004_auto_20190726_0935'),
    ]

    operations = [
        migrations.AlterField(
            model_name='scriptdetails',
            name='order',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
