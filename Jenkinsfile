pipeline {
    agent any

    environment {
        SSH_KEY = credentials('ssh-key-ec2')
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Obtener nombre de la rama
                    def branchName = env.GIT_BRANCH?.replaceFirst(/origin\//, '') ?: 'main'
                    def envFile = ".env.${branchName}"
                    echo "Usando archivo de entorno: ${envFile}"

                    // Verificar si el archivo existe antes de intentar leerlo
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
                    git pull origin $branchName &&
                    npm ci &&
                    pm2 restart health-api || pm2 start server.js --name health-api
                '
                """
            }
        }
    }
}
