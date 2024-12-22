import { createClient as sanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2023-08-01',
  useCdn: true,
  token: import.meta.env.VITE_SANITY_TOKEN,
  ignoreBrowserTokenWarning: true,
});

if (!client) {
  throw new Error('Sanity client is not initialized');
}

const builder = imageUrlBuilder(client);

export const urlFor = (source) => {
  if (!source) {
    throw new Error('Source is missing');
  }

  if (!builder) {
    throw new Error('Image URL builder is not initialized');
  }

  try {
    return builder.image(source);
  } catch (error) {
    throw new Error(`Error building image URL: ${error.message}`);
  }
};
