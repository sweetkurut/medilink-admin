import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-medium text-gray-900 mb-4">Страница не найдена</h2>
        <p className="text-gray-600 mb-8">
          Страница, которую вы ищете, не существует или была перемещена.
        </p>
        <Link to="/appointments" className="btn btn-primary">
          Вернуться к панели управления
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;