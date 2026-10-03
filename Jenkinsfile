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

        // Nueva etapa: Análisis de SonarQube
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool name: 'SonarQubeScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                    withEnv(["PATH+SONAR=${scannerHome}/bin"]) {
                        withSonarQubeEnv('SonarQube') {
                            sh '''
                            sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.projectName=${SONAR_PROJECT_NAME} \
                            -Dsonar.sources=src \
                            -Dsonar.host.url=http://localhost:9000 \
                            -Dsonar.login=${SONAR_AUTH_TOKEN} \
                            -Dsonar.javascript.node=${NODEJS_HOME}/bin/node \
                            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                            '''
                        }
                    }
                }
            }
        }

        // Etapa 2: Instalar dependencias y construir el proyecto
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
                sh 'npm run test:coverage' 
            }
        }
    }

    post {
        always {
            // Agregar notificación de calidad de SonarQube
            script {
                def qg = waitForQualityGate()
                if (qg.status != 'OK') {
                    error "Calidad no aprobada: ${qg.status}"
                }
            }
            // Resto de las acciones post...
        }
    }
}
