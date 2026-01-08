pipeline {
  agent any

  tools {
    nodejs 'Node20'
  }

  environment {
    FIREBASE_TOKEN = credentials('firebase-token')
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main',
            credentialsId: 'github-token',
            url: 'https://github.com/koushal-1435/threadly.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

stage('Deploy to Firebase') {
  steps {
    sh '''
      ./node_modules/.bin/firebase deploy \
        --only hosting \
        --token "$FIREBASE_TOKEN"
    '''
  }
}
  }
  post {
    success {
      echo '🚀 Deployment successful!'
    }
    failure {
      echo '❌ Deployment failed'
    }
  }
}
