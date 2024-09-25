import FileDropzone from '@/components/FileDropzone';
import { DocumentType } from '@/types/onboarding';
import { Link } from '@chakra-ui/next-js';
import {
  Alert,
  AlertIcon,
  Box,
  Heading,
  useBreakpointValue,
} from '@chakra-ui/react';
import Image from 'next/image';

const OnboardingFirstStep: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <>
      <Image
        src="/images/step4-image.png"
        alt="Descripción de la imagen"
        width={isMobile ? 240 : 500}
        height={isMobile ? 120 : 300}
        priority
      />
      <Heading textAlign="center" mb="4" fontSize={{ base: 'xl', md: '4xl' }}>
        Como último paso para crear tu perfil necesitamos que cargues <br />
        esta información:
      </Heading>
      <FileDropzone text="Foto de perfil" id={DocumentType.ProfilePicture} />
      <FileDropzone
        text="Foto DNI frente"
        id={DocumentType.IdentificationFront}
      />
      <FileDropzone
        text="Foto DNI dorso"
        id={DocumentType.IdentificationBack}
      />
      <FileDropzone
        text="Certificado de antecedentes"
        link="https://www.argentina.gob.ar/servicio/solicitar-certificado-de-antecedentes-penales-con-clave-fiscal"
        id={DocumentType.BackgroundVerification}
      />
      <Box mt={2} maxW={460}>
        <Alert
          status="info"
          variant="subtle"
          borderRadius="md"
          fontSize="small"
        >
          <AlertIcon />

          <span>
            El certificado de antecedentes lo puedes subir luego, pero para
            poder operar necesitas tener tus antecedentes cargados. Cómo
            obtenerlo?{' '}
            <Link
              href="https://www.argentina.gob.ar/servicio/solicitar-certificado-de-antecedentes-penales-con-clave-fiscal"
              target="_blank"
              textDecoration="underline"
              fontWeight="bold"
            >
              Más info aquí
            </Link>
          </span>
        </Alert>
      </Box>
    </>
  );
};

export default OnboardingFirstStep;
