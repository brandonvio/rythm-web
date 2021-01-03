#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RythmWebCdkStack } from '../lib/rythm-web-cdk-stack';

const app = new cdk.App();
new RythmWebCdkStack(app, 'RythmWebCdkStack');
