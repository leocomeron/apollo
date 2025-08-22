import { env } from '@/lib/env';
import * as SibApiV3Sdk from '@getbrevo/brevo';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  env.brevo.apiKey,
);

export interface EmailTemplate {
  email: string;
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

      sendSmtpEmail.to = [{ email: template.email }];
      sendSmtpEmail.sender = {
        email: env.brevo.fromEmail,
        name: env.brevo.fromName,
      };
      sendSmtpEmail.subject = template.subject;
      sendSmtpEmail.htmlContent = template.html;
      sendSmtpEmail.textContent =
        template.text || template.html.replace(/<[^>]*>/g, '');

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
      email: data.email,
      subject: '¡Bienvenido a Manos a la Obra!',
      html,
    });
  }

  static async sendNotificationEmail(
    data: NotificationEmailData,
  ): Promise<void> {
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

          ${
            data.actionUrl && data.actionText
              ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.actionUrl}"
                 style="background-color: #3182ce; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                ${data.actionText}
              </a>
            </div>
          `
              : ''
          }

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
      email: data.email,
      subject: data.subject,
      html,
    });
  }

  static async sendOpportunityNotification(
    email: string,
    opportunityTitle: string,
    opportunityId: string,
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
    opportunityId: string,
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
