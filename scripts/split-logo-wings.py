# Separa las alas del logo en capas para animarlas (FlutterLogo).
# Uso: python3 scripts/split-logo-wings.py <carpeta-temporal>
# Genera public/images/logo-{base,wing-l,wing-r,front}.png
from PIL import Image, ImageDraw
import numpy as np, cv2, sys
S=sys.argv[1]
im=np.array(Image.open('public/images/logo.png').convert('RGBA'))
h,w=im.shape[:2]
rgb=im[...,:3]; a=im[...,3]
hsv=cv2.cvtColor(rgb,cv2.COLOR_RGB2HSV).astype(int)
Hh,Sa,V=hsv[...,0],hsv[...,1],hsv[...,2]

def poly(pts):
    m=Image.new('L',(w,h),0); ImageDraw.Draw(m).polygon(pts,fill=255); return np.array(m)>0

# zonas que NO son ala: pelo, brazo, cuerpo
hair=poly([(262,198),(300,196),(310,300),(200,300),(235,262),(252,244),(258,222)])
arm=poly([(440,128),(475,128),(475,300),(385,300),(390,232),(398,196),(418,160),(428,140)])
face=poly([(284,204),(318,204),(333,222),(339,246),(330,272),(284,272)])
hair=hair|face
body=poly([(279,100),(301,100),(304,150),(298,212),(282,212),(276,150)])
# contenido "no fondo": ni crema ni transparente
cream=(Sa<45)&(V>205)
fg=(a>120)&~cream
box=poly([(95,0),(500,0),(500,268),(95,268)])
cand=fg&box&~hair&~arm&~body
# componente principal oscuro + borde dorado: cerrar y quedarse con lo conectado a lo oscuro
dark=(V<120)&cand
k=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(7,7))
core=cv2.morphologyEx(dark.astype(np.uint8),cv2.MORPH_CLOSE,k,iterations=2)
n,lab,st,_=cv2.connectedComponentsWithStats(core)
keep=np.zeros_like(core,bool)
for i in range(1,n):
    if st[i,4]>2000: keep|=lab==i
# rellenar huecos dentro del ala
ff=keep.astype(np.uint8).copy(); inv=(1-ff).astype(np.uint8)
n2,l2,s2,_=cv2.connectedComponentsWithStats(inv)
for i in range(1,n2):
    x,y,ww,hh,ar=s2[i]
    if ar<1500 and x>0 and y>0: ff[l2==i]=1
wing=ff>0
# sumar el borde dorado: candidatos dentro de 7px del ala
grow=cv2.dilate(wing.astype(np.uint8),cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(11,11)))>0
wing=(wing|(grow&cand))
op=cv2.morphologyEx(wing.astype(np.uint8),cv2.MORPH_OPEN,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5)))>0
wing=op
# cola del ala izquierda (rulo dorado abajo a la izquierda)
tail=poly([(165,228),(215,228),(215,268),(165,268)])
wing|=tail&cand
wing&=~hair&~arm&~body
L=wing.copy(); L[:,290:]=False
R=wing.copy(); R[:,:290]=False
np.save(f'{S}/L.npy',L); np.save(f'{S}/R.npy',R)
vis=im.copy(); vis[L]=[255,0,0,255]; vis[R]=[0,0,255,255]
Image.fromarray(vis).crop((80,0,510,290)).resize((860,580)).save(f'{S}/mask.png')
from PIL import Image
import numpy as np, cv2, sys
S=sys.argv[1]
im=np.array(Image.open('public/images/logo.png').convert('RGBA'))
L=np.load(f'{S}/L.npy'); R=np.load(f'{S}/R.npy'); W=L|R
h,w=W.shape
# capas de las alas (con 1px de suavizado en el borde)
def layer(m):
    out=np.zeros_like(im); out[m]=im[m]
    al=cv2.GaussianBlur(m.astype(np.float32),(3,3),0.7)
    out[...,3]=(np.minimum(im[...,3],255)*al).astype(np.uint8)
    return out
wl,wr=layer(L),layer(R)
# base sin alas: inpainting de color y de transparencia
hole=cv2.dilate(W.astype(np.uint8),np.ones((5,5),np.uint8))
pre=im.copy()
rgb=cv2.inpaint(np.ascontiguousarray(pre[...,:3]),hole,9,cv2.INPAINT_TELEA)
al=cv2.inpaint(np.ascontiguousarray(pre[...,3]),hole,9,cv2.INPAINT_TELEA)
base=np.dstack([rgb,al])
# delante de las alas: cuerpo, brazo, cara y pelo (píxeles originales)
from PIL import ImageDraw
def poly(pts):
    m=Image.new('L',(w,h),0); ImageDraw.Draw(m).polygon(pts,fill=255); return np.array(m)>0
front=poly([(279,100),(301,100),(304,150),(298,212),(282,212),(276,150)]) \
 | poly([(440,128),(475,128),(475,300),(385,300),(390,232),(398,196),(418,160),(428,140)]) \
 | poly([(262,198),(300,196),(310,300),(200,300),(235,262),(252,244),(258,222)]) \
 | poly([(284,204),(318,204),(333,222),(339,246),(330,272),(284,272)])
front&=~W
fr=np.zeros_like(im); fr[front]=im[front]
for n,a in [('logo-base',base),('logo-wing-l',wl),('logo-wing-r',wr),('logo-front',fr)]:
    Image.fromarray(a).save(f'public/images/{n}.png',optimize=True)
# previsualizar ángulo máximo
def rot(a,deg,px,py):
    M=cv2.getRotationMatrix2D((px,py),deg,1.0); return cv2.warpAffine(a,M,(w,h),flags=cv2.INTER_LINEAR,borderValue=(0,0,0,0))
for deg in (0,6,-4):
    c=Image.new('RGBA',(w,h),(225,200,240,255))
    for a in [base, rot(wl,-deg,283,150), rot(wr,deg,297,150), fr]:
        c.alpha_composite(Image.fromarray(a))
    c.crop((60,0,530,300)).resize((940,600)).save(f'{S}/flap{deg}.png')
