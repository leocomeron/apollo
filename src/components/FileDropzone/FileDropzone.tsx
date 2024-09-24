import { useOnboarding } from '@/context/OnboardingContext';
import { Document, DocumentType } from '@/types/onboarding';
import { CheckIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Icon,
  Link,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export interface FileDropzoneProps {
  text?: string;
  link?: string;
  id: DocumentType;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  text = 'Arrastra y suelta algunos archivos aquí, o haz clic para seleccionar archivos',
  link,
  id,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { setOnboardingInfo } = useOnboarding();
  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((newFile) => {
      newFile
        .arrayBuffer()
        .then(() => {
          setSelectedFile(newFile);
          const newDocument: Document = { type: id, file: newFile };
          setOnboardingInfo((prevState) => ({
            ...prevState,
            documents: Array.isArray(prevState.documents)
              ? [...prevState.documents, newDocument]
              : [newDocument],
          }));
        })
        .catch((error) => {
          alert(error);
        });
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
      // Agrega más tipos de archivo si es necesario
    },
  });

  return (
    <Box
      {...getRootProps()}
      borderWidth={3}
      borderRadius="50px"
      p={5}
      textAlign="center"
      _hover={{ borderColor: 'brand.600' }}
      cursor="pointer"
      bgColor="brand.600"
      position="relative"
      borderColor="brand.900"
      color="white"
      fontWeight="bold"
      px={{ base: 4, md: 6 }}
      py={{ base: 1, md: 3 }}
      my={{ base: 1, md: 1 }}
      minWidth={isMobile ? 300 : 500}
    >
      <input {...getInputProps()} id={id} />
      {isDragActive ? (
        <Text color="brand.500">Suelta los archivos aquí ...</Text>
      ) : (
        <VStack spacing={4}>
          <Box display="flex" alignItems="center">
            <Text color="white" fontSize={{ base: 'medium', md: '2xl' }}>
              {text}
            </Text>
            {link && (
              <Link
                href={link}
                isExternal
                ml={2}
                color="black"
                display="flex"
                alignItems="center"
                onClick={(e) => e.stopPropagation()}
              >
                <Icon as={ExternalLinkIcon} ml={1} />
              </Link>
            )}
          </Box>
          {selectedFile && (
            <Icon
              as={CheckIcon}
              color="green.400"
              position="absolute"
              right={isMobile ? -6 : -35}
              top={isMobile ? 1 : 4}
              boxSize={isMobile ? 4 : 7}
            />
          )}
        </VStack>
      )}
    </Box>
  );
};

export default FileDropzone;
