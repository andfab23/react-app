pipeline {

    agent any

    tools {
        nodejs 'NodeJS' // Nombre definido en Global Tool Configuration
    }

    environment {
        SONAR_PROJECT_KEY = 'ucp-app-react'
        SONAR_PROJECT_NAME = 'UCP React App'
    }

    stages {

        // Etapa 1: Checkout del código desde GitHub
        stage('Checkout') {
            steps {
                git(
                    branch: 'master',
                    url: 'https://github.com/andfab23/react-app.git'
                )
            }
        }

        // Etapa 2: Instalar dependencias, construir y generar cobertura
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
                sh 'npm run test:coverage' 
            }
        }

        // Etapa 3: Análisis de SonarQube
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool name: 'SonarQubeScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                    withEnv(["PATH+SONAR=${scannerHome}/bin"]) {
                        withSonarQubeEnv('SonarQube') {
                            sh '''
                            sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.projectName="${SONAR_PROJECT_NAME}" \
                            -Dsonar.sources=src \
                            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                            '''
                        }
                    }
                }
            }
        }

        // Etapa 4: Quality Gate de SonarQube
        stage('Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    script {
                        def qg = waitForQualityGate()
                        if (qg.status != 'OK') {
                            error "Calidad no aprobada: ${qg.status}"
                        }
                    }
                }
            }
        }
    }
}
