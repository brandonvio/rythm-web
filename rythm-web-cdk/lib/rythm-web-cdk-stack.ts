import * as cdk from "@aws-cdk/core";
import { WebsiteStack } from "./website-stack";

export class RythmWebCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const websiteStack = new WebsiteStack(this, "RythmWebsiteStack", {
      env: props?.env,
    });
  }
}
