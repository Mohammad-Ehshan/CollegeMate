

// import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'; 
import { db } from '@/lib/Prisma';
import { useUser } from '@clerk/nextjs';
import { uploadImage } from '@/lib/Cloudinary';
import { reportSchema } from '@/lib/schema';

export async function submitReport(formData: FormData) {
  const { user } = useUser();
  const userId = user?.id // Get userId directly from auth()
  
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  try {
    const rawData = {
      title: formData.get('title'),
      category: formData.get('category'),
      location: formData.get('location'),
      description: formData.get('description'),
      image: formData.get('image'),
      type: formData.get('type')
    };

    const parsed = reportSchema.parse({
      ...rawData,
      image: rawData.image instanceof File ? rawData.image : undefined
    });

    let imageUrl = '';
    if (parsed.image) {
      const buffer = await parsed.image.arrayBuffer();
      const result = await uploadImage(Buffer.from(buffer));
      imageUrl = result.secure_url; // Now properly typed
    }

    if (parsed.type === 'lost') {
      await db.lostItem.create({
        data: {
          title: parsed.title,
          category: parsed.category,
          description: parsed.description,
          imageUrl,
          locationLost: parsed.location,
          status: 'PENDING',
          reportedAt: new Date(),
          userId
        }
      });
    } else {
      await db.foundItem.create({
        data: {
          title: parsed.title,
          category: parsed.category,
          description: parsed.description,
          imageUrl,
          locationFound: parsed.location,
          status: 'UNCLAIMED',
          reportedAt: new Date(),
          userId
        }
      });
    }

    // revalidatePath('/');
    redirect('/success');

  } catch (error) {
    console.error('Submission error:', error);
    return {
      error: error instanceof Error 
        ? JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)))
        : 'Failed to submit report'
    };
  }
}