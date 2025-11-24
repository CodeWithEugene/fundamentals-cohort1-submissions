# Frontend Production Checklist

## Pre-Deployment

- [ ] All tests passing: `npm test`
- [ ] No linting errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Backend URL environment variable set
- [ ] No console errors/warnings in dev build
- [ ] Responsive design tested

## Deployment

- [ ] GitHub Actions workflow passing
- [ ] Vercel deployment successful
- [ ] Frontend accessible at production URL
- [ ] Connected to correct backend service
- [ ] Environment variables properly set

## Post-Deployment

- [ ] Test health check endpoint
- [ ] Verify metrics display correctly
- [ ] Check deployment history loads
- [ ] Test auto-refresh functionality
- [ ] Verify dark mode appearance
- [ ] Test on multiple devices/browsers

## Monitoring

- [ ] Monitor Core Web Vitals
- [ ] Track deployment frequency
- [ ] Monitor error rates
- [ ] Check build times
