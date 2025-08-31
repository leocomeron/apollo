# 📧 Implementación de Brevo para Notificaciones Automáticas

## 1. Configuración de Brevo

### Paso 1: Crear cuenta en Brevo

1. Ve a [brevo.com](https://www.brevo.com/es/pricing/) y crea una cuenta gratuita
2. El plan gratuito incluye:
   - 300 emails/día
   - Plantillas de email personalizables
   - Editor "drag & drop"
   - Transaccional (API, SMTP, Webhooks)
   - Campañas SMS y WhatsApp

### Paso 2: Configurar Sender Authentication

- Verifica tu dominio de email (puedes usar tu email personal para empezar)
- Obtén tu API Key desde Settings > API Keys

## 2. Instalación de Dependencias

```bash
npm install @getbrevo/brevo
```

## 3. Configuración de Variables de Entorno

Agrega estas variables a tu archivo `.env.local`:

```env
# Brevo Configuration
BREVO_API_KEY=tu_api_key_aqui
BREVO_FROM_EMAIL=tu_email_verificado@ejemplo.com
BREVO_FROM_NAME=Manos a la Obra
```

## 4. Creación del Servicio de Email con Brevo

Crea el archivo `src/services/email.ts`:

```typescript:src/services/email.ts
import * as SibApiV3Sdk from '@getbrevo/brevo';
import { env } from '@/lib/env';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, env.brevo.apiKey);

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface WelcomeEmailData {
  email: string;
  firstName?: string;
}

export interface NotificationEmailData {
  email: string;
  subject: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}

export class EmailService {
  private static async sendEmail(template: EmailTemplate): Promise<void> {
    try {
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

      sendSmtpEmail.to = [{ email: template.to }];
      sendSmtpEmail.sender = {
        email: env.brevo.fromEmail,
        name: env.brevo.fromName,
      };
      sendSmtpEmail.subject = template.subject;
      sendSmtpEmail.htmlContent = template.html;
      sendSmtpEmail.textContent = template.text || template.html.replace(/<[^>]*>/g, '');

      await apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  static async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    const firstName = data.firstName || 'Usuario';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #2d3748; margin: 0;">¡Bienvenido a Manos a la Obra!</h1>
        </div>

        <div style="padding: 30px 20px;">
          <h2 style="color: #2d3748;">Hola ${firstName},</h2>

          <p style="color: #4a5568; line-height: 1.6;">
            ¡Gracias por unirte a nuestra plataforma! Estamos emocionados de tenerte como parte de nuestra comunidad.
          </p>

          <p style="color: #4a5568; line-height: 1.6;">
            Con Manos a la Obra podrás:
          </p>

          <ul style="color: #4a5568; line-height: 1.6;">
            <li>Encontrar oportunidades laborales</li>
            <li>Conectar con clientes y trabajadores</li>
            <li>Construir tu reputación profesional</li>
            <li>Crecer tu negocio</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${env.nextAuth.url}/onboarding"
               style="background-color: #3182ce; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Completar Perfil
            </a>
          </div>

          <p style="color: #4a5568; line-height: 1.6;">
            Si tienes alguna pregunta, no dudes en contactarnos.
          </p>

          <p style="color: #4a5568; line-height: 1.6;">
            Saludos,<br>
            El equipo de Manos a la Obra
          </p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #718096;">
          <p style="margin: 0;">© 2024 Manos a la Obra. Todos los derechos reservados.</p>
        </div>
      </div>
    `;

    await this.sendEmail({
      to: data.email,
      subject: '¡Bienvenido a Manos a la Obra!',
      html,
    });
  }

  static async sendNotificationEmail(data: NotificationEmailData): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #2d3748; margin: 0;">Manos a la Obra</h1>
        </div>

        <div style="padding: 30px 20px;">
          <h2 style="color: #2d3748;">${data.subject}</h2>

          <p style="color: #4a5568; line-height: 1.6;">
            ${data.message}
          </p>

          ${data.actionUrl && data.actionText ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.actionUrl}"
                 style="background-color: #3182ce; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                ${data.actionText}
              </a>
            </div>
          ` : ''}

          <p style="color: #4a5568; line-height: 1.6;">
            Saludos,<br>
            El equipo de Manos a la Obra
          </p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #718096;">
          <p style="margin: 0;">© 2024 Manos a la Obra. Todos los derechos reservados.</p>
        </div>
      </div>
    `;

    await this.sendEmail({
      to: data.email,
      subject: data.subject,
      html,
    });
  }

  static async sendOpportunityNotification(
    email: string,
    opportunityTitle: string,
    opportunityId: string
  ): Promise<void> {
    await this.sendNotificationEmail({
      email,
      subject: 'Nueva Oportunidad Disponible',
      message: `Se ha publicado una nueva oportunidad: "${opportunityTitle}". ¡Revisa si es para ti!`,
      actionUrl: `${env.nextAuth.url}/opportunities/${opportunityId}`,
      actionText: 'Ver Oportunidad',
    });
  }

  static async sendProposalNotification(
    email: string,
    opportunityTitle: string,
    opportunityId: string
  ): Promise<void> {
    await this.sendNotificationEmail({
      email,
      subject: 'Nueva Propuesta Recibida',
      message: `Has recibido una nueva propuesta para la oportunidad: "${opportunityTitle}".`,
      actionUrl: `${env.nextAuth.url}/opportunities/${opportunityId}`,
      actionText: 'Ver Propuesta',
    });
  }
}
```

## 6. Actualización del API de Registro

Actualiza tu archivo `src/pages/api/auth/signup.ts`:

```typescript:src/pages/api/auth/signup.ts
import clientPromise from '@/lib/mongodb';
import { EmailService } from '@/services/email';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { email, password, firstName } = req.body;

    const client = await clientPromise;
    const db = client.db('worker_hub');

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
      firstName: firstName || null,
      lastName: null,
      birthDate: null,
      location: null,
      isOnboardingCompleted: false,
      isVerified: false,
    });

    // Send welcome email
    try {
      await EmailService.sendWelcomeEmail({ email, firstName });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the signup if email fails
    }

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
```

## 7. Creación de API para Envío de Notificaciones

Crea el archivo `src/pages/api/notifications/send.ts`:

```typescript:src/pages/api/notifications/send.ts
import { EmailService } from '@/services/email';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { to, subject, message, actionUrl, actionText } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({
        message: 'Missing required fields: to, subject, message'
      });
    }

    await EmailService.sendNotificationEmail({
      email: to,
      subject,
      message,
      actionUrl,
      actionText,
    });

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
}
```

## 8. Creación del Hook para Notificaciones

Crea el archivo `src/hooks/useEmailNotifications.ts`:

```typescript:src/hooks/useEmailNotifications.ts
export const useEmailNotifications = () => {
  const sendOpportunityNotification = async (
    email: string,
    opportunityTitle: string,
    opportunityId: string
  ) => {
    try {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Nueva Oportunidad Disponible',
          message: `Se ha publicado una nueva oportunidad: "${opportunityTitle}". ¡Revisa si es para ti!`,
          actionUrl: `/opportunities/${opportunityId}`,
          actionText: 'Ver Oportunidad',
        }),
      });
    } catch (error) {
      console.error('Failed to send opportunity notification:', error);
    }
  };

  const sendProposalNotification = async (
    email: string,
    opportunityTitle: string,
    opportunityId: string
  ) => {
    try {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Nueva Propuesta Recibida',
          message: `Has recibido una nueva propuesta para la oportunidad: "${opportunityTitle}".`,
          actionUrl: `/opportunities/${opportunityId}`,
          actionText: 'Ver Propuesta',
        }),
      });
    } catch (error) {
      console.error('Failed to send proposal notification:', error);
    }
  };

  return {
    sendOpportunityNotification,
    sendProposalNotification,
  };
};
```

## 9. Configuración en Vercel

1. Ve a tu dashboard de Vercel
2. Selecciona tu proyecto `manosalaobra`
3. Ve a Settings > Environment Variables
4. Agrega las variables de Brevo:
   - `BREVO_API_KEY`
   - `BREVO_FROM_EMAIL`
   - `BREVO_FROM_NAME`

## 10. Ventajas de Brevo vs SendGrid

- **Plan gratuito**: 300 emails/día vs SendGrid que es más limitado
- **Precio**: Mucho más económico para volúmenes pequeños
- **Funcionalidades**: Incluye SMS, WhatsApp, notificaciones push
- **Templates**: Editor drag & drop incluido
- **API**: RESTful API con documentación completa

## 11. Pruebas y Verificación

1. **Prueba local**: Usa `npm run dev` y registra un usuario
2. **Verifica en Brevo**: Revisa el dashboard de Brevo para ver emails enviados
3. **Prueba en producción**: Deploy y prueba el registro de usuarios

## 12. Monitoreo y Logs

Brevo te proporciona:

- Dashboard con estadísticas de envío
- Logs de emails entregados/fallidos
- Métricas de engagement
- Análisis de apertura y clics

## 13. Próximos Pasos Recomendados

1. **Templates personalizados**: Crea más templates para diferentes tipos de notificaciones
2. **Sistema de suscripciones**: Permite a usuarios elegir qué notificaciones recibir
3. **Notificaciones push**: Considera implementar notificaciones en tiempo real
4. **Analytics**: Integra con herramientas como Mixpanel o Amplitude
5. **SMS y WhatsApp**: Aprovecha las funcionalidades adicionales de Brevo

## 14. Consideraciones de Producción

- **Rate limiting**: Brevo tiene límites según tu plan (300 emails/día en gratuito)
- **Bounce handling**: Implementa manejo de emails rebotados
- **Unsubscribe**: Agrega enlaces de desuscripción
- **Compliance**: Asegúrate de cumplir con leyes de privacidad (GDPR, CAN-SPAM)
- **Escalabilidad**: Considera planes de pago cuando superes los 300 emails/día

## 15. Estructura de Archivos Final

```
src/
├── lib/
│   └── env.ts (actualizado con Brevo)
├── services/
│   └── email.ts (nuevo con Brevo)
├── pages/
│   └── api/
│       ├── auth/
│       │   └── signup.ts (actualizado)
│       └── notifications/
│           └── send.ts (nuevo)
└── hooks/
    └── useEmailNotifications.ts (nuevo)
```

## 16. Comandos de Instalación

```bash
# Instalar dependencia de Brevo
npm install @getbrevo/brevo

# Crear directorios necesarios
mkdir -p src/services
mkdir -p src/pages/api/notifications
mkdir -p src/hooks

# Verificar que todo funcione
npm run build
```

## 17. Solución de Problemas Comunes

### Error: "Missing required environment variable"

- Verifica que todas las variables estén en `.env.local`
- Reinicia el servidor de desarrollo después de agregar variables

### Error: "Failed to send email"

- Verifica que tu API key de Brevo sea correcta
- Asegúrate de que tu email esté verificado en Brevo
- Revisa los logs de la consola para más detalles

### Error: "Unauthorized"

- Verifica que la sesión esté activa
- Revisa la configuración de NextAuth

## 18. Recursos Adicionales

- [Documentación oficial de Brevo](https://developers.brevo.com/)
- [API Reference](https://developers.brevo.com/reference)
- [Templates de email](https://www.brevo.com/es/plantillas-email/)
- [Centro de ayuda](https://help.brevo.com/)

---

**Nota**: Este documento asume que ya tienes NextAuth configurado. Si necesitas ayuda con la configuración de NextAuth, consulta la documentación oficial o avísame para ayudarte con esa parte.
