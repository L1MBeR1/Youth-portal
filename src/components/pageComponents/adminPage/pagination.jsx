import React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

const Pagination = ({ setPage, page, lastPage = 1 }) => {
  console.log("Pagination props:", { setPage, page, lastPage });

  const handlePreviousPage = () => {
    console.log("Previous page");
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    console.log("Next page");
    setPage((prevPage) => Math.min(prevPage + 1, lastPage));
  };

  const handlePageClick = (pageNumber) => {
    console.log("Page click:", pageNumber);
    setPage(pageNumber);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Button
        onClick={handlePreviousPage}
        disabled={page === 1}
      >
        Назад
      </Button>
      {[...Array(lastPage)].map((_, index) => {
        const pageNumber = index + 1;
        return (
          <IconButton
            key={pageNumber}
            onClick={() => handlePageClick(pageNumber)}
          >
            {pageNumber}
          </IconButton>
        );
      })}
      <Button
        onClick={handleNextPage}
        disabled={page === lastPage}
      >
        Вперед
      </Button>
    </Box>
  );
};

export default Pagination;