import * as SibApiV3Sdk from '@getbrevo/brevo';

const BREVO_API_KEY = process.env.BREVO_API_KEY ?? '';
const BREVO_FROM_EMAIL = process.env.BREVO_FROM_EMAIL ?? '';
const BREVO_FROM_NAME = process.env.BREVO_FROM_NAME ?? '';
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  BREVO_API_KEY,
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

export interface WorkerVerificationData {
  email: string;
  firstName?: string;
}

export interface ProposalRejectionData {
  email: string;
  firstName?: string;
  opportunityTitle: string;
  opportunityId: string;
}

export interface ProposalAcceptanceData {
  email: string;
  firstName?: string;
  opportunityTitle: string;
  opportunityId: string;
  employerContact: string;
}

export interface ReviewNotificationData {
  email: string;
  firstName?: string;
  opportunityTitle: string;
  opportunityId: string;
  employerId: string;
}

export class EmailService {
  private static readonly emailStyles = {
    container:
      'font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;',
    header: 'background-color: #f8f9fa; padding: 20px; text-align: center;',
    headerTitle: 'color: #2d3748; margin: 0;',
    content: 'padding: 30px 20px;',
    contentTitle: 'color: #2d3748;',
    contentText: 'color: #4a5568; line-height: 1.6;',
    contentTextBold: 'color: #4a5568; line-height: 1.6; font-weight: bold;',
    contentList: 'color: #4a5568; line-height: 1.6;',
    buttonContainer: 'text-align: center; margin: 30px 0;',
    primaryButton:
      'background-color: #3182ce; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;',
    successButton:
      'background-color: #38a169; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;',
    infoBox:
      'background-color: #e6fffa; border: 1px solid #81e6d9; border-radius: 5px; padding: 20px; margin: 20px 0;',
    footer:
      'background-color: #f8f9fa; padding: 20px; text-align: center; color: #718096;',
    footerText: 'margin: 0;',
  };

  private static createEmailHeader(title: string): string {
    return `
      <div style="${this.emailStyles.header}">
        <h1 style="${this.emailStyles.headerTitle}">${title}</h1>
      </div>
    `;
  }

  private static createEmailFooter(): string {
    return `
      <div style="${this.emailStyles.footer}">
        <p style="${this.emailStyles.footerText}">© 2024 Manos a la Obra. Todos los derechos reservados.</p>
      </div>
    `;
  }

  private static createActionButton(
    url: string,
    text: string,
    buttonStyle: string = this.emailStyles.primaryButton,
  ): string {
    return `
      <div style="${this.emailStyles.buttonContainer}">
        <a href="${url}" style="${buttonStyle}">
          ${text}
        </a>
      </div>
    `;
  }

  private static createInfoBox(title: string, content: string): string {
    return `
      <div style="${this.emailStyles.infoBox}">
        <h3 style="${this.emailStyles.contentTitle}; margin-top: 0;">${title}</h3>
        <p style="${this.emailStyles.contentText}; margin: 0;">${content}</p>
      </div>
    `;
  }

  private static createEmailContainer(header: string, content: string): string {
    return `
      <div style="${this.emailStyles.container}">
        ${header}
        <div style="${this.emailStyles.content}">
          ${content}
        </div>
        ${this.createEmailFooter()}
      </div>
    `;
  }

  private static async sendEmail(template: EmailTemplate): Promise<void> {
    try {
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

      sendSmtpEmail.to = [{ email: template.email }];
      sendSmtpEmail.sender = {
        email: BREVO_FROM_EMAIL,
        name: BREVO_FROM_NAME,
      };
      sendSmtpEmail.subject = template.subject;
      sendSmtpEmail.htmlContent = template.html;
      sendSmtpEmail.textContent =
        template.text || template.html.replace(/<[^>]*>/g, '');
      console.log('Sending email:', sendSmtpEmail);
      await apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  static async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    const firstName = data.firstName || 'Usuario';

    const content = `
      <h2 style="${this.emailStyles.contentTitle}">Hola ${firstName},</h2>

      <p style="${this.emailStyles.contentText}">
        ¡Gracias por unirte a nuestra plataforma! Estamos emocionados de tenerte como parte de nuestra comunidad.
      </p>

      <p style="${this.emailStyles.contentText}">
        Con Manos a la Obra podrás:
      </p>

      <ul style="${this.emailStyles.contentList}">
        <li>Encontrar oportunidades laborales</li>
        <li>Conectar con clientes y trabajadores</li>
        <li>Construir tu reputación profesional</li>
        <li>Crecer tu negocio</li>
      </ul>

      ${this.createActionButton(
        `${NEXT_PUBLIC_API_URL}/onboarding`,
        'Completar Perfil',
        this.emailStyles.primaryButton,
      )}

      <p style="${this.emailStyles.contentText}">
        Si tienes alguna pregunta, no dudes en contactarnos.
      </p>

      <p style="${this.emailStyles.contentText}">
        Saludos,<br>
        El equipo de Manos a la Obra
      </p>
    `;

    const html = this.createEmailContainer(
      this.createEmailHeader('¡Bienvenido a Manos a la Obra!'),
      content,
    );

    await this.sendEmail({
      email: data.email,
      subject: '¡Bienvenido a Manos a la Obra!',
      html,
    });
  }
  static async sendProposalNotification(
    email: string,
    opportunityTitle: string,
    opportunityId: string,
    firstName?: string,
  ): Promise<void> {
    const ownerName = firstName || email.split('@')[0] || 'Usuario';

    const html = `
      <h2 style="${this.emailStyles.contentTitle}">Hola ${ownerName},</h2>

      <p style="${this.emailStyles.contentText}">
        Has recibido una nueva propuesta para la oportunidad: "${opportunityTitle}".
      </p>

      ${this.createActionButton(
        `${NEXT_PUBLIC_API_URL}/opportunities/${opportunityId}`,
        'Ver Propuesta',
      )}

      <p style="${this.emailStyles.contentText}">
        Saludos,<br>
        El equipo de Manos a la Obra
      </p>
    

      ${this.createEmailFooter()}
    `;

    await this.sendEmail({
      email,
      subject: 'Nueva Propuesta Recibida',
      html,
    });
  }

  static async sendWorkerVerificationEmail(
    data: WorkerVerificationData,
  ): Promise<void> {
    const firstName = data.firstName || 'Usuario';

    const content = `
      <h2 style="${this.emailStyles.contentTitle}">Hola ${firstName},</h2>

      <p style="${this.emailStyles.contentText}">
        ¡Excelentes noticias! Tu perfil ha sido verificado exitosamente en Manos a la Obra.
      </p>

      <p style="${this.emailStyles.contentText}">
        Esto significa que:
      </p>

      <ul style="${this.emailStyles.contentList}">
        <li>Tu perfil ahora aparece como "Verificado"</li>
        <li>Puedes aplicar a todas las oportunidades disponibles</li>
        <li>Los empleadores confiarán más en tu perfil</li>
        <li>Tendrás mayor visibilidad en la plataforma</li>
      </ul>

      ${this.createActionButton(
        `${NEXT_PUBLIC_API_URL}/profile`,
        'Ver Mi Perfil',
        this.emailStyles.successButton,
      )}

      <p style="${this.emailStyles.contentText}">
        ¡Ahora puedes comenzar a aplicar a oportunidades y crecer tu negocio!
      </p>

      <p style="${this.emailStyles.contentText}">
        Saludos,<br>
        El equipo de Manos a la Obra
      </p>
    `;

    const html = this.createEmailContainer(
      this.createEmailHeader('¡Perfil Verificado!'),
      content,
    );

    await this.sendEmail({
      email: data.email,
      subject: '¡Tu Perfil Ha Sido Verificado!',
      html,
    });
  }

  static async sendProposalRejectionEmail(
    data: ProposalRejectionData,
  ): Promise<void> {
    const firstName = data.firstName || 'Usuario';

    const content = `
      <h2 style="${this.emailStyles.contentTitle}">Hola ${firstName},</h2>

      <p style="${this.emailStyles.contentText}">
        Queremos informarte que tu propuesta para la oportunidad <strong>"${data.opportunityTitle}"</strong> no fue seleccionada en esta ocasión.
      </p>

      <p style="${this.emailStyles.contentText}">
        <strong>No te desanimes</strong> - esto es parte del proceso y no refleja tu capacidad profesional. Cada oportunidad es única y los empleadores buscan perfiles específicos.
      </p>

      <p style="${this.emailStyles.contentText}">
        <strong>Consejos para mejorar:</strong>
      </p>

      <ul style="${this.emailStyles.contentList}">
        <li>Revisa y actualiza tu perfil regularmente</li>
        <li>Personaliza tus propuestas según cada oportunidad</li>
        <li>Destaca tu experiencia relevante</li>
        <li>Mantén un portafolio actualizado</li>
      </ul>

      ${this.createActionButton(
        `${NEXT_PUBLIC_API_URL}/opportunities`,
        'Ver Más Oportunidades',
      )}

      <p style="${this.emailStyles.contentText}">
        ¡Sigue adelante! La próxima oportunidad perfecta está a la vuelta de la esquina.
      </p>

      <p style="${this.emailStyles.contentText}">
        Saludos,<br>
        El equipo de Manos a la Obra
      </p>
    `;

    const html = this.createEmailContainer(
      this.createEmailHeader('Actualización de Propuesta'),
      content,
    );

    await this.sendEmail({
      email: data.email,
      subject: 'Actualización de tu Propuesta',
      html,
    });
  }

  static async sendProposalAcceptanceEmail(
    data: ProposalAcceptanceData,
  ): Promise<void> {
    const firstName = data.firstName || 'Usuario';

    const content = `
      <h2 style="${this.emailStyles.contentTitle}">¡Felicitaciones ${firstName}!</h2>

      <p style="${this.emailStyles.contentText}">
        Tu propuesta para la oportunidad <strong>"${data.opportunityTitle}"</strong> ha sido aceptada. ¡Excelente trabajo!
      </p>

      <p style="${this.emailStyles.contentText}">
        <strong>Próximos pasos:</strong>
      </p>

      <ul style="${this.emailStyles.contentList}">
        <li>Contacta al empleador para coordinar detalles</li>
        <li>Acuerda fechas, horarios y condiciones</li>
        <li>Confirma el alcance del trabajo</li>
        <li>Establece la forma de pago</li>
      </ul>

      ${this.createInfoBox(
        'Información de Contacto del Empleador:',
        `<strong>Contacto:</strong> ${data.employerContact}`,
      )}

      ${this.createActionButton(
        `${NEXT_PUBLIC_API_URL}/opportunities/${data.opportunityId}`,
        'Ver Detalles de la Oportunidad',
        this.emailStyles.successButton,
      )}

      <p style="${this.emailStyles.contentText}">
        ¡Que tengas mucho éxito en este nuevo proyecto!
      </p>

      <p style="${this.emailStyles.contentText}">
        Saludos,<br>
        El equipo de Manos a la Obra
      </p>
    `;

    const html = this.createEmailContainer(
      this.createEmailHeader('¡Propuesta Aceptada!'),
      content,
    );

    await this.sendEmail({
      email: data.email,
      subject: '¡Tu Propuesta Ha Sido Aceptada!',
      html,
    });
  }

  static async sendReviewNotificationEmail(
    data: ReviewNotificationData,
  ): Promise<void> {
    const firstName = data.firstName || 'Usuario';

    const content = `
      <h2 style="${this.emailStyles.contentTitle}">Hola ${firstName},</h2>

      <p style="${this.emailStyles.contentText}">
        La oportunidad <strong>"${data.opportunityTitle}"</strong> ha sido finalizada y el empleador ha dejado una evaluación de tu trabajo.
      </p>

      <p style="${this.emailStyles.contentText}">
        <strong>Ahora es tu turno de evaluar al empleador.</strong> Tu opinión es valiosa para la comunidad y ayuda a otros trabajadores a tomar decisiones informadas.
      </p>

      <p style="${this.emailStyles.contentText}">
        <strong>¿Por qué es importante dejar una review?</strong>
      </p>

      <ul style="${this.emailStyles.contentList}">
        <li>Ayuda a otros trabajadores a conocer al empleador</li>
        <li>Construye una comunidad más transparente</li>
        <li>Mejora la calidad general de la plataforma</li>
        <li>Es parte de tu reputación profesional</li>
      </ul>

      ${this.createActionButton(
        `${NEXT_PUBLIC_API_URL}/profile/${data.employerId}`,
        'Dejar Review al Empleador',
      )}

      <p style="${this.emailStyles.contentText}">
        ¡Gracias por contribuir a nuestra comunidad!
      </p>

      <p style="${this.emailStyles.contentText}">
        Saludos,<br>
        El equipo de Manos a la Obra
      </p>
    `;

    const html = this.createEmailContainer(
      this.createEmailHeader('Oportunidad Finalizada'),
      content,
    );

    await this.sendEmail({
      email: data.email,
      subject: 'Oportunidad Finalizada - Deja tu Review',
      html,
    });
  }
}
