pipeline {
  agent any

  tools {
    nodejs 'Node20'
  }

  stages {
    stage('Checkout') {
      steps {
        git credentialsId: 'github-token',
            url: 'https://github.com/koushal-1435/threadly.git',
            branch: 'main'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
  }

  stage('Deploy to Firebase') {
  environment {
    FIREBASE_TOKEN = credentials('firebase-token')
  }
  steps {
    sh 'npm run build'
    sh 'npx firebase deploy --token "$FIREBASE_TOKEN"'
  }
}

}
