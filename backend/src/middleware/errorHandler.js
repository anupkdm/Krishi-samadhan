function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: message, details: err.details });
    }
    if (err.name === 'AuthError') {
        return res.status(401).json({ error: message });
    }
    if (err.name === 'NotFoundError') {
        return res.status(404).json({ error: message });
    }

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
}

module.exports = errorHandler;
