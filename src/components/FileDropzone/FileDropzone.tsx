import { useOnboarding } from '@/context/OnboardingContext';
import { Document, DocumentType } from '@/types/onboarding';
import { CheckIcon } from '@chakra-ui/icons';
import { Box, Icon, Text, useBreakpointValue, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export interface FileDropzoneProps {
  text?: string;
  documentType: DocumentType;
  displayCheckIcon?: boolean;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  text = 'Arrastra y suelta algunos archivos aquí, o haz clic para seleccionar archivos',
  documentType,
  displayCheckIcon,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { setOnboardingInfo } = useOnboarding();
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      const newFile = acceptedFiles[0];
      if (!newFile) return;

      setSelectedFile(newFile);
      const cloudinaryUrl = await uploadToCloudinary(newFile);

      const newDocument: Document = {
        type: documentType,
        file: newFile,
        url: cloudinaryUrl,
      };

      setOnboardingInfo((prevState) => {
        const documents = Array.isArray(prevState.documents)
          ? prevState.documents
          : [];

        const existingDocIndex = documents.findIndex(
          (doc) => doc.type === documentType,
        );

        if (existingDocIndex !== -1) {
          const updatedDocuments = [...documents];
          updatedDocuments[existingDocIndex] = newDocument;
          return {
            ...prevState,
            documents: updatedDocuments,
          };
        } else {
          return {
            ...prevState,
            documents: [...documents, newDocument],
          };
        }
      });
    } catch (error) {
      alert('Error al subir el archivo');
      console.error(error);
      setSelectedFile(undefined);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
    },
    multiple: false,
  });

  return (
    <Box
      {...getRootProps()}
      borderWidth={3}
      borderRadius="50px"
      textAlign="center"
      _hover={{ borderColor: 'brand.600' }}
      cursor={isUploading ? 'wait' : 'pointer'}
      bgColor="brand.600"
      position="relative"
      borderColor="brand.900"
      color="white"
      fontWeight="bold"
      px={{ base: 4, md: 6 }}
      py={{ base: 1, md: 1 }}
      my={{ base: 1, md: 1 }}
      minWidth={isMobile ? 280 : 320}
      opacity={isUploading ? 0.5 : 1}
    >
      <input {...getInputProps()} id={documentType} disabled={isUploading} />
      {isDragActive ? (
        <Text color="brand.500" fontSize={{ base: 'small', md: 'medium' }}>
          Suelta los archivos aquí ...
        </Text>
      ) : (
        <VStack spacing={4}>
          <Box display="flex" alignItems="center">
            <Text color="white" fontSize={{ base: 'small', md: 'medium' }}>
              {isUploading ? 'Subiendo...' : text}
            </Text>
          </Box>
          {selectedFile && displayCheckIcon && (
            <Icon
              as={CheckIcon}
              color="green.400"
              position="absolute"
              right={isMobile ? -6 : -35}
              top={isMobile ? 1 : 0}
              boxSize={isMobile ? 4 : 7}
            />
          )}
        </VStack>
      )}
    </Box>
  );
};

export default FileDropzone;
