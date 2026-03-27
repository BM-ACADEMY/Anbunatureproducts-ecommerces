import { Link, useLocation } from 'react-router-dom';
import { LuChevronRight } from 'react-icons/lu';
import { FiHome } from 'react-icons/fi';

const Breadcrumbs = () => {
  const location = useLocation();
  const segmentsToSkip = ['user', 'dashboard', 'order-details'];
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  // Create breadcrumb items, skipping specific segments
  const breadcrumbItems = [];
  let accumulatedPath = '';
  
  pathnames.forEach((segment) => {
    accumulatedPath += `/${segment}`;
    if (!segmentsToSkip.includes(segment.toLowerCase())) {
      breadcrumbItems.push({
        label: segment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        path: accumulatedPath,
      });
    }
  });

  return (
    <nav className="flex px-0 py-3 text-gray-700 bg-transparent rounded-lg" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
          >
            <FiHome className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>
        {breadcrumbItems.map((item, index) => {
          const last = index === breadcrumbItems.length - 1;

          return (
            <li key={item.path}>
              <div className="flex items-center">
                <LuChevronRight className="w-5 h-5 text-gray-400" />
                {last ? (
                  <span className="ml-1 text-sm font-medium text-green-600 md:ml-2">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-green-600 md:ml-2 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
