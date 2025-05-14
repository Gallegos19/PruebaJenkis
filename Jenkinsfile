pipeline {
    agent any

    environment {
        SSH_KEY = credentials('ssh-key-ec2')
        BRANCH_NAME = "${env.GIT_BRANCH?.replaceFirst(/origin\//, '') ?: 'main'}"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Detectar el nombre de la rama
                    def envFile = ".env.${BRANCH_NAME}"
                    echo "Usando archivo de entorno: ${envFile}"

                    // Verificar si el archivo de entorno existe
                    if (fileExists(envFile)) {
                        def envVars = readFile(envFile).split('\n')
                        for (line in envVars) {
                            if (line.trim()) {
                                def (key, value) = line.trim().split('=')
                                env[key] = value
                            }
                        }
                    } else {
                        error "El archivo ${envFile} no existe. Asegúrate de que esté presente en el repositorio."
                    }
                }

                // Clonar el repositorio
                git branch: 'main', url: 'https://github.com/Gallegos19/PruebaJenkis.git'
            }
        }

        stage('Build') {
            steps {
                sh 'rm -rf node_modules'
                sh 'npm ci'
            }
        }

        stage('Deploy') {
            steps {
                sh """
                ssh -i $SSH_KEY -o StrictHostKeyChecking=no $EC2_USER@$EC2_IP '
                    cd $REMOTE_PATH &&
                    git pull origin $BRANCH_NAME &&
                    npm ci &&
                    pm2 restart health-api || pm2 start server.js --name health-api
                '
                """
            }
        }
    }
}
