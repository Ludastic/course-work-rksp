import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 py-12">
      <AlertTriangle size={64} className="text-orange-500 mb-6" />
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
        404 - Страница не найдена
      </h1>
      
      <p className="text-xl text-gray-600 mb-8 text-center max-w-md">
        Страница, которую вы ищете, не существует или была перемещена.
      </p>
      
      <Link to="/">
        <Button size="lg">
          Вернуться на главную
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;