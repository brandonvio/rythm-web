// Testing webhook. #3
pipeline {
    agent any
    stages {
        stage('Validate') {
            steps {
                sh 'aws --version'
                sh 'cdk --version'
                sh 'node --version'
                sh 'npm --version'
                sh 'tsc --version'
            }
        }

        stage('Build') {
            steps {
                withAWS(credentials: 'build-credentials', region: 'us-west-2') {
                    dir('rythm-web-cdk') {
                        sh 'npm install'
                        sh 'cdk list'
                        sh 'cdk synth --all'
                        sh 'cdk deploy "RythmWebCdkStackRythmWebsiteStack6F3AF491" --require-approval=never'
                    }
                    dir('rythm-web-app') {
                        sh 'npm install'
                        sh 'npm run build'
                        sh 'aws s3 sync ./build s3://origin.rythm.cc --acl public-read'
                    }
                }
            }
        }
    }
}
