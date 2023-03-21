# Proceso estructurado de para desarrollo de aplicaciones web

## Investigación, entendiendo la naturaleza de la aplicación

Es necesario comprender la naturaleza del proyecto. Esto parece obvio, pero casi siempre lleva tiempo entender lo que desean los clientes, en especial cuando ellos mismos no saben por completo que quieren.

## Planificación, establecer el plan de trabajo

Planificación y revisión es una “fase permanente” que siguen los procesos de desarrollo definiendo un plan de proyecto compuesto por una lista de actividades las cuales tienes que revisar durante la ejecución del proyecto(responsables, tiempo estimado, coste, etc).

## Generar y gestionar la documentación

Los proyectos requieren documentación desde el principio; es muy probable que esta documentación sufra muchos cambios. Por esta razón, desde el principio debe disponerse de una estrategia para mantener los documentos que se generen.

## Captura de los requisitos

Hay que reunir los requisitos que ha de cumplir la aplicación. Gran parte de esta actividad es conversar con los “interesados/clientes”. Se deben definir el alcance y necesidades de tu aplicación web en términos de lo tu aplicación debe hacer, las principales funcionalidades y requisitos técnicos

* ### Alcance

  Para definir el alcance de tu aplicación web es suficiente con recopilar una lista detallada de las funcionalidades con una descripción clara. En este punto no es importante “cómo” se realizara esto pero si el “qué” es lo que se debe realizar

* ### Necesidades

  Analizar las necesidades es una parte crucial del proceso de desarrollo. En este paso debes estimar tu tráfico potencial, escoger un lenguaje de lado del servidor (PHP, ASP, Coldfusion…), bases de datos, seleccionar un proveedor de servicio de hospedaje… No debes sobrestimar/subestimar tus estimaciones. Evalúa cada cosa con un balance adecuado entre tiempos, costos y objetivos.

## Arquitectura de la aplicación y su contenido

De acuerdo con las características de la aplicación, se elaboran las vistas que corresponden a los aspectos arquitecturales:

* ### Vista de Subsistemas y Componentes

Hace referencia a los grandes módulos (subsistemas y componentes) con que se construyen la aplicación

* ### Vista de Concurrencia y Recursos

Hace referencia a los niveles de concurrencia que se deben incorporar en la aplicación y en los recurso necesarios para una operación concurrente segura

* ### Vista de Distribución

Hace referencia a como se establecen diferentes espacios de direcciones, como se distribuyen los módulos software entre ellos, y los mecanismos, formatos y protocolos de colaboración entre ellos

* ### Vista de Seguridad y Fiabilidad

Hace referencia a los niveles de redundancia necesarios para hacer fiable el sistema y a la gestión de los fallos que puedan producirse en la aplicación.

* ### Vista de Despliegue

Hace referencia a la forma de mapear los componentes software en los diferentes elementos físicos (procesadores, discos, dispositivos, etc.) que constituyen la plataforma hardware del sistema.

**Esta fase de DISEÑO DE LA ARQUITECTURA se realiza fundamentalmente incorporando patrones conocidos relativos a los aspectos que se desean optimizar.**

**Los productos que se generan en esta fase son diagramas de clases que  representan la estructura y diagramas de secuencias que describen las colaboraciones.**

Más concretamente debemos pasar por las siguientes fases:

### 1. Diseño: Mapa de la Aplicación

Un mapa de la aplicación contiene solamente información significativa y esencial acerca de la estructura de tu aplicación: paginas (representadas como bloques) y principales relaciones entre ellas. Tu mapa de aplicación debería ser algo así:

De esta forma tienes un mapa con algunas “ubicaciones” (páginas) y una “ruta” (relaciones entre páginas) las que sencillamente debes seguir en orden para proceder, página por página, para implementar tu aplicación en la siguiente fase. De esta forma ahorraras mucho tiempo, teniendo claro e la mente que es lo que debes implementar.

### 2. Diseño: Base de Datos

Ahora es el momento de diseñar la base de datos para tu aplicación. Una forma simple de hacerlo es usando modelos Entidad-Relación. En general puedes seguir este orden: define primero tablas, luego atributos y relaciones entre tablas. Tu modelo ER debería parecerse a este:

### 3. Diseño: Estructura de la Página/Aplicación/Interfaz

El siguiente paso es hacer una maqueta de tu página, identificando todas las secciones principales usando un nombre (por ejemplo #header, #navbar, #mainContent, #sidebar).

### 4. Diseño: Lenguaje del lado del servidor

Teniendo en mente la orientación a objetos para el desarrollo de tu aplicación, puedes definir clases, funciones y toda la funcionalidad el lado del servidor que necesites. Recuerda … esto no es la “ejecución” pero si una forma de tener una “guía” para o que deberás implementar en la siguiente fase.

### 5. Diseño: JS Framework

En este paso seleccionamos un JavaScript Framework (jQuery, Scriptaculous, MooTools…), que proveería las funcionalidades que quieres implementar (arrastrar y soltar, animación, efectos …) recopilando una lista de que funcionalidades específicas están relacionadas con una o más páginas en tu aplicación.

En este punto la fase de diseño esta completa. Puedes iniciar con tu ejecución.

## Desarrollo (programación y diseño) de la aplicación

Hay que analizar el problema, diseñar la solución y codificar los programas.

* Los productos que genera son también diagramas de clases y diagramas de colaboración. En este nivel suelen ser útiles los diagramas de estados.

* Estructuras de datos

* Generación del código: codificación en lenguaje fuente (ya sea manualmente o automáticamente), compilación, enlazado, e instalación en el entorno de ejecución

Ahora comienza el trabajo de realizar tu aplicación. dividiremos esta tarea en varios pasos, no todos tienen porque ser necesarios en tu proyecto concreto:

* Ejecución: Base de Datos
Crea una nueva base de datos y escribe el código SQL para definir tus tablas, atributos y relaciones.

* Ejecución: HTML
Este es el momento para adicionar al HTML todos los elementos que necesites en las secciones identificadas durante la fase de Diseño.

* Ejecución: CSS
Una vez lista la estructura principal, inicias a escribir código CSS para adicionar estilos a tu aplicación.

* Ejecución: Lenguaje del lado del servidor.
Implementa las clases de la aplicación, funciones, interacciones con la Base de Datos, consultas, y cualquier cosa que requiera interacción del lado del servidor.

* Ejecución: JavaScript
Implementa las fucnionalidades AJAX usando el framework que escojiste en la fase de diseño.

## Probar y validar el producto

El producto inicial y final debe probarse en forma exhaustiva en todos sus aspectos.

* Plan de prueba del funcionamiento del código
* Informe de errores y defectos.

## Entregar y mantener el producto

Una vez entregado el producto, entra el modo “mantenimiento, que incluye reparaciones y mejoras. Durante esta fase debes someter el código de tu aplicación a varias condiciones de ejecución (por ejemplo diferentes navegadores). Tu objetivo es detectar todos los errores en tu aplicación antes del lanzamiento final.

Recuerda, este proceso debe ser meticuloso y requiere mucha paciencia. Probar cada página y cada funcionalidad (también en este caso puede ayudarte tu mapa de aplicación para proceder con cierto orden). Si encuentras un error durante la pruebas de ejecución, corrigelo modificando el código y entonces realizas la validación final (una prueba posterior) del código.

Es una actividad que consume muchos recursos, a veces hasta el 65% de los recursos utilizados en el desarrollo de la aplicación. Ello hace hace que ha sea considerado un objetivo fundamental.

## Presentación y defensa (Lanzamiento)

----------------------------------------------------------------------------------------------------------------
El contenido de este artículo, incluyendo imágenes y referencias, es una traducción de original que puede encontrarse en la siguiente dirección:
<http://woork.blogspot.com/2009/01/structured-process-you-must-know-to.html>
