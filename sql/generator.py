import uuid
from faker import Faker
import random
from datetime import datetime, timedelta
import requests


sql = "-- Usuarios\n\n"

# Inicializar Faker
fake = Faker()

def get_unsplash_image():
    access_key = 'zGEKQcn38W8E0A-gem7WG7e9KfCiwzi8885gvmp7sVI'
    desired_width = 800 
    desired_height = 800  
    orientation = "landscape"
    url = f"https://api.unsplash.com/photos/random/?query=profile&client_id={access_key}&w={desired_width}&h={desired_height}&orientation={orientation}"
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.json()['urls']['regular']
    else:
        return "https://source.unsplash.com/random"

# Crear datos para la tabla 'user_entity'
def generate_user_entity_data(n):
    data = []
    emails = set()  # Para asegurarse de que los emails sean únicos

    for _ in range(n):
        # Generar un nombre y un login únicos
        name = fake.name()
        login = fake.user_name()

        # Generar un email único
        email = f"{login}@uniandes.edu.co"
        while email in emails:
            login = fake.user_name()
            email = f"{login}@uniandes.edu.co"
        emails.add(email)

        # Generar un UUID único
        user_id = str(uuid.uuid4())

        # Generar una contraseña
        password = fake.password(length=10, special_chars=True, digits=True, upper_case=True, lower_case=True)

        # Obtener un URL de imagen de Unsplash
        image = get_unsplash_image()

        # Añadir a la lista de datos
        data.append((user_id, name, login, email, password, image))

    return data


# Generar 30 registros para 'user_entity'
user_entity_data = generate_user_entity_data(20)

# Imprimir los comandos SQL
for user_id, name, login, email, password, image in user_entity_data:
    sql += f"INSERT INTO user_entity (id, name, login, email, password, image) VALUES ('{user_id}', '{name}', '{login}', '{email}', '{password}', '{image}');\n"
sql += "\n-- Settings (generados automáticamente en el API)\n\n"

# Función para generar datos de 'settings'
def generate_settings_data(user_ids):
    data = []

    for user_id in user_ids:
        settings_id = str(uuid.uuid4())
        start_hour = 6
        end_hour = 20
        last_labor_day = 7
        enable_grid = 'true'

        data.append((settings_id, start_hour, end_hour, last_labor_day, enable_grid, user_id))

    return data

# Asumiendo que 'user_entity_data' es la lista de usuarios que generaste previamente
user_ids = [user_id for user_id, _, _, _, _, _ in user_entity_data]

# Generar datos para 'settings'
settings_data = generate_settings_data(user_ids)

# Imprimir los comandos SQL para 'settings_entity'
for settings_id, start_hour, end_hour, last_labor_day, enable_grid, user_id in settings_data:
    sql += f'''INSERT INTO settings_entity (id, "startHour", "endHour", "lastLaborDay", "enableGrid", "userId") VALUES ('{settings_id}', {start_hour}, {end_hour}, {last_labor_day}, {enable_grid}, '{user_id}');\n'''

sql += "\n-- Amigos\n\n"

# Función para generar amistades
def generate_friendships(user_ids, min_friends=5):
    friendships = set()

    for user_id in user_ids:
        # Asegurarse de tener al menos 'min_friends' amigos
        friends = set(random.sample(user_ids, min_friends))

        # Remover la posibilidad de amistad con uno mismo
        friends.discard(user_id)

        # Añadir amistades a la lista, evitando duplicados
        for friend in friends:
            friendship = tuple(sorted([user_id, friend]))
            friendships.add(friendship)

    return friendships

# Asumiendo que 'user_ids' es la lista de IDs de usuarios generados previamente
friendships_data = generate_friendships([user_id for user_id, _, _, _, _, _ in user_entity_data])

# Imprimir los comandos SQL para 'user_entity_friends_user_entity'
for user1, user2 in friendships_data:
    sql += f'''INSERT INTO user_entity_friends_user_entity ("userEntityId_1", "userEntityId_2") VALUES ('{user1}', '{user2}');\n'''

sql += "\n-- Grupos\n\n"

group_names = [
    "Programación Web", "Reinforcement Learning", "Data Science", 
    "Teoría de Grafos", "Matemáticas Discretas", "Inteligencia Artificial",
    "Seguridad Informática", "Redes Neuronales", "Análisis de Algoritmos",
    "Ingeniería de Software", "Computación Cuántica", "Robótica",
    "Biología Computacional", "Ciencias de Materiales", "Energías Renovables",
    "Astrofísica", "Química Orgánica", "Física de Partículas",
    "Historia de la Ciencia", "Filosofía de la Tecnología", "Sistemas Distribuidos",
    "Cloud Computing", "Big Data", "Machine Learning Avanzado",
    "Criptografía", "Bioinformática", "Diseño de Videojuegos",
    "Realidad Virtual", "Ciencia de Datos Aplicada", "Análisis Financiero",
    "Economía Computacional", "Educación a Distancia", "Psicología Cognitiva",
    "Nanotecnología", "Genómica", "Meteorología", "Oceanografía",
    "Arqueología Digital", "Linguística Computacional", "Derecho y Tecnología"
]

# Función para generar datos de 'group_entity'
def generate_group_entity_data(user_ids, group_names, n):
    data = []
    for _ in range(n):
        group_id = str(uuid.uuid4())
        name = random.choice(group_names)
        owner_id = random.choice(user_ids)

        data.append((group_id, name, owner_id))

    return data

# Asumiendo que 'user_entity_data' es la lista de usuarios que generaste previamente
user_ids = [user_id for user_id, _, _, _, _, _ in user_entity_data]

# Generar datos para 'group_entity'
group_entity_data = generate_group_entity_data(user_ids, group_names, 40)  # Cambiar el 10 por la cantidad deseada

# Imprimir los comandos SQL para 'group_entity'
for group_id, name, owner_id in group_entity_data:
    sql += f'''INSERT INTO group_entity (id, name,"ownerId") VALUES ('{group_id}', '{name}', '{owner_id}');\n'''

sql += "\n-- Miembros de grupos\n\n"

# Función para generar membresías de grupo
def generate_group_memberships(user_ids, group_data, min_groups=4):
    memberships = set()

    # Mapear los IDs de grupo a sus respectivos dueños
    owner_dict = {group_id: owner_id for group_id, _, owner_id in group_data}

    for user_id in user_ids:
        # Seleccionar grupos aleatorios, excluyendo aquellos donde el usuario es dueño
        available_groups = [group_id for group_id, _, owner_id in group_data if owner_id != user_id]
        selected_groups = set(random.sample(available_groups, min_groups))

        # Añadir las membresías a la lista
        for group_id in selected_groups:
            memberships.add((group_id, user_id))

    return memberships

# Asumiendo que 'group_entity_data' es la lista de datos de grupos generados previamente
group_memberships_data = generate_group_memberships(user_ids, group_entity_data)

# Imprimir los comandos SQL para 'group_entity_members_user_entity'
for group_id, user_id in group_memberships_data:
    sql += f'''INSERT INTO group_entity_members_user_entity ("groupEntityId", "userEntityId") VALUES ('{group_id}', '{user_id}');\n'''

sql += "\n-- Calendarios (generados automáticamente en el API)\n\n"

# Función para generar colores hexadecimales
def generate_hex_color():
    return f"#{''.join(random.choices('0123456789ABCDEF', k=6))}"

# Función para generar datos de calendarios para usuarios y grupos
def generate_calendar_data(user_ids, group_ids):
    calendar_data = []

    # Generar calendarios para usuarios
    for user_id in user_ids:
        calendar_id = str(uuid.uuid4())
        color = generate_hex_color()
        calendar_data.append((calendar_id, color, user_id, None))

    # Generar calendarios para grupos
    for group_id in group_ids:
        calendar_id = str(uuid.uuid4())
        color = generate_hex_color()
        calendar_data.append((calendar_id, color, None, group_id))

    return calendar_data

# Obteniendo los IDs de grupo de los datos de grupo
group_ids = [group_id for group_id, _, _ in group_entity_data]

# Generar datos de calendario
calendar_data = generate_calendar_data(user_ids, group_ids)

# Imprimir los comandos SQL para 'calendar_entity'
for calendar_id, color, user_id, group_id in calendar_data:
    user_id_value = f"'{user_id}'" if user_id else 'NULL'
    group_id_value = f"'{group_id}'" if group_id else 'NULL'
    sql += f'''INSERT INTO calendar_entity (id, color, "userId", "groupId") VALUES ('{calendar_id}', '{color}', {user_id_value}, {group_id_value});\n'''

sql += "\n-- Notificaciones\n\n"

# Lista de textos de notificaciones
notification_texts = [
    "Tu evento ''Reunión de trabajo'' comienza en 30 minutos.",
    "Nuevo mensaje en el chat del grupo ''Taller de programación''.",
    "Recordatorio: Clase de idiomas mañana a las 10:00 AM.",
    "Actualización disponible para la aplicación.",
    "Invitación a unirse al grupo ''Data Science''.",
    "Sugerencia: Completa tu perfil para mejorar las recomendaciones.",
    "Evento ''Seminario de investigación'' ha cambiado de fecha.",
    "Encuesta de satisfacción disponible hasta el viernes.",
    "Nueva función de calendario ahora disponible.",
    "Recordatorio: Revisión de proyectos este jueves."
]

# Función para generar fechas de notificaciones
def generate_notification_dates(start_date, end_date, num_notifications):
    dates = []
    for _ in range(num_notifications):
        date = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
        hour = random.choice(range(8, 18))  # Horas entre 8 AM y 6 PM
        minute = random.choice([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55])
        notification_date = datetime.combine(date, datetime.min.time()) + timedelta(hours=hour, minutes=minute)
        dates.append(notification_date)
    return dates

# Generar fechas de notificaciones
start_date = datetime(2023, 12, 6)
end_date = datetime(2023, 12, 20)
notification_dates = generate_notification_dates(start_date, end_date, 10)

# Generar sentencias SQL para 'notification_entity'
sql_statements = []
for user_id in user_ids:
    for text, date in zip(notification_texts, notification_dates):
        notification_id = str(uuid.uuid4())
        sql_n = f'''INSERT INTO notification_entity (id, text, date, redirection, "userId") VALUES ('{notification_id}', '{text}', '{date.isoformat()}', NULL, '{user_id}');'''
        sql_statements.append(sql_n)

# Imprimir las sentencias SQL
for sql_notifications in sql_statements:
    sql += f"{sql_notifications}\n"

sql += "\n-- Eventos\n\n"

# Eventos para usuarios
user_events = [
    {"name": "Ejercicio matutino", "description": "Sesión de ejercicio", "start_hour": 7, "duration": 90},  # 7:30 AM a 9:00 AM
    {"name": "Reunión de trabajo", "description": "Discusión de proyectos", "start_hour": 9, "duration": 45},  # 9:00 AM a 9:45 AM
    {"name": "Estudio individual", "description": "Sesión de estudio", "start_hour": 10, "duration": 60},  # 10:00 AM a 11:00 AM
    {"name": "Almuerzo", "description": "Tiempo de descanso y comida", "start_hour": 12, "duration": 60},  # 12:00 PM a 1:00 PM
    {"name": "Lectura académica", "description": "Lectura de artículos", "start_hour": 15, "duration": 45},  # 3:00 PM a 3:45 PM
    {"name": "Clase de idiomas", "description": "Clase de inglés", "start_hour": 16, "duration": 60},  # 4:00 PM a 5:00 PM
    {"name": "Tiempo de ocio", "description": "Relajación y hobbies", "start_hour": 18, "duration": 90},  # 6:00 PM a 7:30 PM
    {"name": "Cena", "description": "Cena con amigos", "start_hour": 20, "duration": 60},  # 8:00 PM a 9:00 PM
    {"name": "Meditación nocturna", "description": "Sesión de meditación", "start_hour": 21, "duration": 30},  # 9:00 PM a 9:30 PM
    {"name": "Curso de programación", "description": "Curso de programación", "start_hour": 14, "duration": 120},  # 2:00 PM a 4:00 PM
    # ... Añade más eventos aquí
]

# Eventos para grupos
group_events = [
    {"name": "Taller de programación", "description": "Sesión de codificación grupal", "start_hour": 10, "duration": 120},  # 10:00 AM a 12:00 PM
    {"name": "Revisión de proyectos", "description": "Evaluación de avances", "start_hour": 14, "duration": 60},  # 2:00 PM a 3:00 PM
    {"name": "Discusión de tesis", "description": "Reunión para discutir avances de tesis", "start_hour": 9, "duration": 90},  # 9:00 AM a 10:30 AM
    {"name": "Seminario de investigación", "description": "Seminario sobre temas actuales", "start_hour": 11, "duration": 120},  # 11:00 AM a 1:00 PM
    {"name": "Tutoría grupal", "description": "Sesión de tutorías y preguntas", "start_hour": 15, "duration": 60},  # 3:00 PM a 4:00 PM
    {"name": "Planificación de proyecto", "description": "Organización de actividades del proyecto", "start_hour": 16, "duration": 90},  # 4:00 PM a 5:30 PM
    {"name": "Brainstorming creativo", "description": "Sesión de lluvia de ideas", "start_hour": 17, "duration": 60},  # 5:00 PM a 6:00 PM
    {"name": "Encuentro de networking", "description": "Interacción y conexión con otros grupos", "start_hour": 18, "duration": 90},  # 6:00 PM a 7:30 PM
    {"name": "Reunión de trabajo", "description": "Discusión de proyectos", "start_hour": 9, "duration": 45},  # 9:00 AM a 9:45 AM
    {"name": "Reunión de avances", "description": "Discusión de avances de proyectos", "start_hour": 14, "duration": 60},  # 2:00 PM a 3:00 PM
    # ... Añade más eventos aquí
]

# Función para verificar si dos eventos se solapan
def is_overlapping(event1, event2):
    return not (event1[2] >= event2[3] or event2[2] >= event1[3])

# Función modificada para generar las fechas de inicio y fin sin solapamientos
def generate_event_dates(start_date, end_date, events_list, min_events):
    all_events = []
    while len(all_events) < min_events:
        for event in events_list:
            date = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
            start_time = datetime.combine(date, datetime.min.time()) + timedelta(hours=event["start_hour"], minutes=random.choice([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]))
            end_time = start_time + timedelta(minutes=event["duration"])

            new_event = (event["name"], event["description"], start_time, end_time)

            # Comprobar si el nuevo evento se solapa con los existentes
            if not any(is_overlapping(new_event, existing_event) for existing_event in all_events):
                all_events.append(new_event)
                if len(all_events) >= min_events:
                    break
    return all_events

# Función para calcular visualEndDate
def calculate_visual_end_date(start_date, end_date):
    if (end_date - start_date) >= timedelta(minutes=20):
        return end_date
    else:
        return start_date + timedelta(minutes=20)

# Función para generar datos de eventos y sentencias SQL
def generate_events_and_sql(calendar_ids, start_date, end_date, events_list, min_events):
    sql_statements = []
    for calendar_id in calendar_ids:
        events = generate_event_dates(start_date, end_date, events_list, min_events)
        for name, description, start, end in events:
            event_id = str(uuid.uuid4())
            color = generate_hex_color()
            is_private = 'false'
            alert_choices = [5, 10, 30, None]
            alert = random.choice(alert_choices)
            location = "Uniandes"
            visual_end_date = calculate_visual_end_date(start, end)

            # Crear la sentencia SQL
            sql = f'''INSERT INTO event_entity (id, name, location, link, "isPrivate", alert, "startDate", "endDate", "visualEndDate", description, color, "calendarId") VALUES ('{event_id}', '{name}', '{location}', '', {is_private}, {alert if alert is not None else 'NULL'}, '{start.isoformat()}', '{end.isoformat()}', '{visual_end_date.isoformat()}', '{description}', '{color}', '{calendar_id}');'''
            sql_statements.append(sql)
    return sql_statements

# Definir las fechas entre las que deben estar los eventos
start_date = datetime(2023, 11, 27)
end_date = datetime(2023, 12, 16)

# Asumiendo que 'calendar_data' es la lista de datos de calendario generados previamente
calendar_ids = [calendar_id for calendar_id, _, _, _ in calendar_data]

# Generar eventos y sentencias SQL para calendarios de usuarios y grupos
user_sql = generate_events_and_sql(calendar_ids, start_date, end_date, user_events, 10)  # 10 eventos para cada calendario de usuario
group_sql = generate_events_and_sql(calendar_ids, start_date, end_date, group_events, 10)  # 10 eventos para cada calendario de grupo

# Imprimir las sentencias SQL
for sql_event in user_sql + group_sql:
    sql += f"{sql_event}\n"

# Agregar todo a data.sql
with open("data.sql", "w", encoding='utf-8') as f:
    f.write(sql)

