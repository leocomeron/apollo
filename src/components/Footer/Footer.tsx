import {
  Box,
  Container,
  Divider,
  Flex,
  HStack,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      as="footer"
      bg="gray.50"
      borderTop="1px"
      borderColor="gray.200"
      mt="auto"
      w="100vw"
      position="relative"
      left="50%"
      right="50%"
      marginLeft="-50vw"
      marginRight="-50vw"
      pb="16px"
      mb="-16px"
    >
      <Container maxW="100%" px={8} py={8}>
        <VStack spacing={6} align="stretch">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'center', md: 'flex-start' }}
            gap={6}
          >
            <VStack align={{ base: 'center', md: 'flex-start' }} spacing={3}>
              <Text fontSize="lg" fontWeight="bold" color="gray.800">
                Manos a la Obra
              </Text>
              <Text
                fontSize="sm"
                color="gray.600"
                textAlign={{ base: 'center', md: 'left' }}
                maxW="300px"
              >
                Conectamos clientes con trabajadores calificados para hacer
                realidad tus proyectos
              </Text>
            </VStack>

            <HStack
              spacing={8}
              wrap="wrap"
              justify={{ base: 'center', md: 'flex-end' }}
            >
              <VStack align={{ base: 'center', md: 'flex-start' }} spacing={2}>
                <Text fontWeight="semibold" color="gray.800">
                  Servicios
                </Text>
                <Link
                  href="/"
                  color="gray.600"
                  _hover={{ color: 'brand.600' }}
                  fontSize="xs"
                >
                  Oportunidades
                </Link>
                <Link
                  href="/"
                  color="gray.600"
                  _hover={{ color: 'brand.600' }}
                  fontSize="xs"
                >
                  Trabajadores
                </Link>
                <Link
                  href="/opportunities/create"
                  color="gray.600"
                  _hover={{ color: 'brand.600' }}
                  fontSize="xs"
                >
                  Publicar Trabajo
                </Link>
              </VStack>

              <VStack align={{ base: 'center', md: 'flex-start' }} spacing={2}>
                <Text fontWeight="semibold" color="gray.800">
                  Empresa
                </Text>
                <Link
                  href="/"
                  color="gray.600"
                  _hover={{ color: 'brand.600' }}
                  fontSize="xs"
                >
                  Sobre Nosotros
                </Link>
                <Link
                  href="/"
                  color="gray.600"
                  _hover={{ color: 'brand.600' }}
                  fontSize="xs"
                >
                  Contacto
                </Link>
                <Link
                  href="/"
                  color="gray.600"
                  _hover={{ color: 'brand.600' }}
                  fontSize="xs"
                >
                  Ayuda
                </Link>
              </VStack>

              <VStack align={{ base: 'center', md: 'flex-start' }} spacing={2}>
                <Text fontWeight="semibold" color="gray.800">
                  Legal
                </Text>
                <Link
                  href="/"
                  color="gray.600"
                  _hover={{ color: 'brand.600' }}
                  fontSize="xs"
                >
                  Términos y Condiciones
                </Link>
                <Link
                  href="/"
                  color="gray.600"
                  _hover={{ color: 'brand.600' }}
                  fontSize="xs"
                >
                  Política de Privacidad
                </Link>
                <Box h="18px" />
              </VStack>
            </HStack>
          </Flex>

          <Divider borderColor="gray.300" />

          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'center', md: 'center' }}
            gap={4}
          >
            <Text fontSize="sm" color="gray.600">
              © {currentYear} Manos a la Obra. Todos los derechos reservados.
            </Text>

            <HStack spacing={4}>
              <Text fontSize="sm" color="gray.600">
                Hecho en Argentina 🇦🇷
              </Text>
            </HStack>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
}
