import { Container } from './container'

export function Footer() {
  return (
    <footer className="border-t">
      <Container>
        <div className="py-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} 개발 블로그. Powered by Notion &amp;
            Vercel.
          </p>
        </div>
      </Container>
    </footer>
  )
}
