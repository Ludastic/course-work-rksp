import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Review, ReviewFormData } from '../types';
import Input from './ui/Input';
import TextArea from './ui/TextArea';
import Button from './ui/Button';
import StarRating from './ui/StarRating';
import FileUpload from './ui/FileUpload';

interface ReviewFormProps {
  initialData?: Review;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  isEditing?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ 
  initialData, 
  onSubmit, 
  isEditing = false
}) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ReviewFormData>({
    title: initialData?.title || '',
    text: initialData?.text || '',
    rating: initialData?.rating || 5,
    photoBase64: initialData?.photoBase64 || undefined,
    photoContentType: initialData?.photoContentType || undefined,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Название должно содержать минимум 3 символа';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Название должно быть короче 255 символов';
    }
    
    if (formData.text.length > 1000) {
      newErrors.text = 'Текст отзыва должен быть короче 1000 символов';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };
  
  const handlePhotoChange = async (file: File) => {
    try {
      // If file is empty, clear the photo data
      if (file.size === 0) {
        setFormData(prev => ({
          ...prev,
          photoBase64: undefined,
          photoContentType: undefined
        }));
        return;
      }

      // Validate file size (max 5MB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        setErrors(prev => ({
          ...prev,
          photo: 'Размер изображения должен быть меньше 5MB'
        }));
        return;
      }

      // Read the file as base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64.split(',')[1];
        console.log('Converted image to base64:', {
          originalSize: file.size,
          base64Size: base64Data.length,
          type: file.type
        });
        setFormData(prev => ({
          ...prev,
          photoBase64: base64Data,
          photoContentType: file.type
        }));
      };
      reader.onerror = () => {
        setErrors(prev => ({
          ...prev,
          photo: 'Не удалось прочитать файл изображения'
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error reading file:', error);
      setErrors(prev => ({
        ...prev,
        photo: 'Не удалось обработать изображение. Пожалуйста, попробуйте снова.'
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting form data:', {
        title: formData.title,
        hasPhoto: !!formData.photoBase64,
        photoType: formData.photoContentType
      });
      
      await onSubmit(formData);
      navigate('/');
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Название"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="Введите название отзыва"
        required
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Оценка
        </label>
        <StarRating
          value={formData.rating}
          onChange={handleRatingChange}
        />
      </div>
      
      <TextArea
        label="Текст отзыва"
        name="text"
        value={formData.text}
        onChange={handleChange}
        error={errors.text}
        placeholder="Напишите ваш отзыв здесь..."
        rows={6}
      />
      
      <FileUpload
        onSuccess={handlePhotoChange}
        currentUrl={formData.photoBase64 ? `data:${formData.photoContentType};base64,${formData.photoBase64}` : undefined}
      />
      
      <div className="flex space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/')}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {isEditing ? 'Обновить отзыв' : 'Опубликовать отзыв'}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;