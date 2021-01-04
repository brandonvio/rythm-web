import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as ssm from "@aws-cdk/aws-ssm";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";

export class WebsiteStack extends cdk.Stack {
  public readonly distributionDomainName: cdk.CfnOutput;
  public readonly apiUrlOutput: cdk.CfnOutput;
  public readonly websiteUrlOutput: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    //*****************************************************************************/
    // S3 website bucket.
    //*****************************************************************************/
    // const reactBuildPath = path.resolve(__dirname, "../builds/react-app-build/build");

    const bucket = new s3.Bucket(this, "reactAppBucket", {
      bucketName: "origin.rythm.cc",
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
    });

    this.websiteUrlOutput = new cdk.CfnOutput(this, "websiteUrlOutput", {
      value: bucket.bucketWebsiteUrl,
    });

    const certificateCrn = ssm.StringParameter.valueForStringParameter(
      this,
      "rythm-east-certificate-arn",
      1
    );

    // //*****************************************************************************/
    // // CloudFront.
    // //*****************************************************************************/
    const sslCertificate = acm.Certificate.fromCertificateArn(
      this,
      "RythmCertificate",
      certificateCrn
    );

    const cloudFrontDist = new cloudfront.Distribution(this, "RythmCloudFrontDist", {
      defaultRootObject: "index.html",
      certificate: sslCertificate,
      domainNames: ["app.rythm.cc"],
      defaultBehavior: {
        origin: new origins.S3Origin(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });

    this.distributionDomainName = new cdk.CfnOutput(this, "distributionDomainName", {
      value: cloudFrontDist.distributionDomainName,
    });

    // //*****************************************************************************/
    // // Deployment.
    // //*****************************************************************************/
    // const hostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(this, "hostedZone", {
    //   hostedZoneId: "Z04032513RU0Y99VPUBXM",
    //   zoneName: "mytodos.xyz",
    // });

    // const arecord = new route53.ARecord(this, "arecord", {
    //   zone: hostedZone,
    //   recordName: "mytodos.xyz",
    //   target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(cloudFrontDist)),
    // });
  }
}
