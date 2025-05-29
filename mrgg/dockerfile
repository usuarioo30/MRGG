# Usar una imagen de OpenJDK con JDK (ya que necesitamos compilar el código)
FROM eclipse-temurin:17-jdk AS builder
 
# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar todos los archivos del directorio actual
COPY . .

# Ejecutar Maven para construir el archivo JAR
RUN chmod +x ./mvnw
RUN ./mvnw clean package

# Ahora crear la imagen final usando la imagen de OpenJDK con solo JRE
FROM eclipse-temurin:17-jre

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el archivo JAR generado desde la imagen del build
COPY --from=builder /app/target/*.jar app.jar

# Exponer el puerto en el que tu aplicación se ejecutará
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "app.jar"]