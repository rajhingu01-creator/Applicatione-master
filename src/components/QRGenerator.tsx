import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRGeneratorProps {
  value: string;
  size?: number;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ value, size = 200 }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow-inner inline-block">
      <QRCodeSVG 
        value={value} 
        size={size}
        level="H"
        includeMargin={true}
        imageSettings={{
          src: "/favicon.svg",
          x: undefined,
          y: undefined,
          height: 24,
          width: 24,
          excavate: true,
        }}
      />
    </div>
  );
};

export default QRGenerator;
