import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';
import path from 'path';

// To deploy as a lib (npm):
// https://articles.wesionary.team/react-component-library-with-vite-and-deploy-in-npm-579c2880d6ff

// https://vitejs.dev/config/
export default defineConfig({
  plugins: process.env.BUILD_MODE === 'lib' ? [react(), dts()] : [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: process.env.BUILD_MODE === 'lib' ? false : undefined,
  base: './',
  build:
    process.env.BUILD_MODE === 'lib'
      ? {
          lib: {
            entry: path.resolve(__dirname, 'src/lib/index.ts'),
            name: 'react-localify',
            fileName: (format) => `index.${format}.js`,
          },
          rollupOptions: {
            external: [
              'react',
              'react-dom',
              'react/jsx-runtime',
              'react-dom/server',
            ],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
                'react/jsx-runtime': 'react/jsx-runtime',
                'react-dom/server': 'ReactDOMServer',
              },
            },
          },
          sourcemap: true,
          emptyOutDir: true,
        }
      : { emptyOutDir: true },
});
